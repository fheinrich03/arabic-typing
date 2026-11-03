"""Builds the drill vocabulary from public Arabic frequency sources.

Outputs:
- src/data/wordList.ts: real words (undiacritized) and fully voweled Quran
  word forms (for the diacritics unit).
- src/data/pseudoWords.ts: pronounceable pseudo-words per letter lesson, for
  lessons whose known letters form too few real words. Every pseudo-word is
  checked against a large lexicon, so none is accidentally a real word.

Also prints a coverage report: how many real words each letter lesson in
src/data/lessons.ts can draw from.

Sources (downloaded into .cache/ on first run):
- Quran: Tanzil Project, "simple" and "simple-clean" text (https://tanzil.net).
  Word forms are counted as they appear (with attached clitics like و/ف/ب).
- Modern Standard Arabic: "1000+ most common words" list from Talk In Arabic
  (https://talkinarabic.com/arabic-words/).
- Leipzig Corpora Collection, Arabic news 2020 and Wikipedia 2021 (300K
  sentences each, CC BY, https://wortschatz.uni-leipzig.de): drops malformed
  MSA entries and serves as the lexicon pseudo-words must not occur in.

Usage: python3 scripts/word-list/build.py
"""

import collections
import html
import io
import math
import random
import re
import tarfile
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
CACHE = Path(__file__).resolve().parent / ".cache"
WORD_LIST_OUT = ROOT / "src" / "data" / "wordList.ts"
PSEUDO_OUT = ROOT / "src" / "data" / "pseudoWords.ts"
LESSONS = ROOT / "src" / "data" / "lessons.ts"

TANZIL_URL = "https://tanzil.net/pub/download/index.php?quranType={}&outType=txt-2&agree=true"
MSA_URL = "https://talkinarabic.com/arabic-words/"
LEIPZIG_CORPORA = ["ara_news_2020_300K", "ara_wikipedia_2021_300K"]

# Quran word forms must occur at least this often to count as common.
MIN_QURAN_COUNT = 3
# MSA words must occur at least this often in the Leipzig corpora (filters
# typos and fragments that the source list produces when splitting variants).
MIN_CORPUS_COUNT = 3
VOWELED_WORD_LIMIT = 2500
PSEUDO_WORDS_PER_LESSON = 60
# Mirrors lessonGenerator.ts: below MIN_WORDS_FOR_WORD_DRILLS typeable real
# words a lesson drills patterns; from FULL_REAL_WORD_POOL real words with the
# lesson's letter on, it needs no pseudo-words. Keep both values in sync.
MIN_WORDS_FOR_WORD_DRILLS = 20
FULL_REAL_WORD_POOL = 10
PSEUDO_CANDIDATES_PER_LESSON = 600

MARKS = "ًٌٍَُِّْ"
TASHKIL = re.compile("[ً-ْٰـ]")
ARABIC_WORD = re.compile("^[ء-ي]{2,}$")
VOWELED_WORD = re.compile(f"^[ء-ي{MARKS}]{{2,}}$")
LIGATURES = ["لآ", "لأ", "لإ", "لا"]

# Not words: the article and suffixes listed on their own in the MSA list,
# and the disjointed letters (muqatta'at) opening some surahs.
EXCLUDED = {
    "ال", "ات", "ون",
    "الم", "الر", "المر", "المص", "كهيعص", "طه", "طسم", "طس", "يس", "حم", "عسق",
}

# Out of context, isolated drill words about killing, cursing or indecency
# read badly (e.g. "اقتلوا"), so they are left out even when common.
EXCLUDED_PATTERN = re.compile("قتل|فاحش|سوآت|إرهاب|^(لعنة|اللعنة|لعنهم|لعنت|بغيا)$")

# Vulgar roots and slurs (mostly dialectal, so possibly missing from the
# news/Wikipedia lexicon). Pseudo-words containing any of them are dropped.
PSEUDO_BLOCKLIST = ["كس", "زب", "نيك", "نيج", "طيز", "شرموط", "عرص", "قحب", "خول", "منيو", "متناك", "لوطي"]


def fetch(url: str, name: str) -> Path:
    path = CACHE / name
    if not path.exists():
        CACHE.mkdir(exist_ok=True)
        request = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
        with urllib.request.urlopen(request, timeout=300) as response:
            path.write_bytes(response.read())
    return path


def normalize(word: str) -> str:
    return TASHKIL.sub("", word).strip()


def tokens(word: str) -> list[str]:
    """Splits a word into keystroke units — lam-alif ligatures are one key."""
    out: list[str] = []
    i = 0
    while i < len(word):
        ligature = next((l for l in LIGATURES if word.startswith(l, i)), None)
        out.append(ligature or word[i])
        i += len(ligature or word[i])
    return out


def quran_words(quran_type: str) -> list[str]:
    text = fetch(TANZIL_URL.format(quran_type), f"quran-{quran_type}.txt").read_text("utf-8")
    words: list[str] = []
    for line in text.splitlines():
        if line.startswith("#") or line.count("|") < 2:
            continue
        words.extend(line.split("|", 2)[2].split())
    return words


def msa_ranks() -> dict[str, int]:
    page = fetch(MSA_URL, "talkinarabic.html").read_text("utf-8")
    table = page[page.find("<table") : page.find("</table>")]
    ranks: dict[str, int] = {}
    rank = 0
    for row in re.findall(r"<tr.*?</tr>", table, re.S)[1:]:
        cells = [html.unescape(re.sub(r"<.*?>", "", c)).strip() for c in re.findall(r"<td.*?</td>", row, re.S)]
        # Long meanings wrap into continuation rows without an Arabic cell.
        if len(cells) < 2 or not cells[0]:
            continue
        rank += 1
        # Entries list variants ("يوم، أيام") and phrases ("بعد أن").
        for part in re.split(r"[،,/…\s]+", normalize(cells[0])):
            ranks.setdefault(part, rank)
    return ranks


def corpus_counts() -> collections.Counter[str]:
    counts: collections.Counter[str] = collections.Counter()
    for corpus in LEIPZIG_CORPORA:
        url = f"https://downloads.wortschatz-leipzig.de/corpora/{corpus}.tar.gz"
        with tarfile.open(fetch(url, f"{corpus}.tar.gz")) as tar:
            member = tar.getmember(f"{corpus}/{corpus}-words.txt")
            for line in io.TextIOWrapper(tar.extractfile(member), encoding="utf-8"):
                _, word, count = line.rstrip("\n").split("\t")
                counts[normalize(word)] += int(count)
    return counts


def is_allowed(word: str) -> bool:
    return bool(ARABIC_WORD.match(word)) and word not in EXCLUDED and not EXCLUDED_PATTERN.search(word)


def rank_words(quran: dict[str, int], msa: dict[str, int]) -> list[str]:
    """Merges both frequency lists, scaling MSA ranks to the longer Quran list."""
    quran_rank = {w: i + 1 for i, w in enumerate(sorted(quran, key=lambda w: -quran[w]))}
    scale = len(quran) / len(msa)
    words = {w for w in quran.keys() | msa.keys() if is_allowed(w)}

    def score(word: str) -> float:
        return min(quran_rank.get(word, math.inf), msa.get(word, math.inf) * scale)

    return sorted(words, key=lambda w: (score(w), w))


def voweled_words(clean_words: set[str]) -> list[str]:
    """Most frequent fully voweled Quran forms whose bare form is a list word."""
    counts: collections.Counter[str] = collections.Counter()
    for word in quran_words("simple"):
        # Dagger alif is a Quranic spelling of a long a — plain spelling omits it.
        word = word.replace("ٰ", "")
        # Quranic assimilation puts a shadda on a word's first letter
        # (e.g. "مُّبِين"), which standard spelling never does.
        if word[1:2] == "\u0651":
            continue
        if VOWELED_WORD.match(word) and normalize(word) in clean_words:
            counts[word] += 1
    return [w for w, _ in counts.most_common(VOWELED_WORD_LIMIT)]


def lesson_letters() -> list[str]:
    """Letters in the order the course introduces them (units 1-4)."""
    source = LESSONS.read_text("utf-8")
    calls = re.findall(r'letterLesson\(\s*"unit[1-4]",\s*"\w+",\s*"[^"]*",\s*"([^"]+)"', source)
    return calls


class BigramModel:
    def __init__(self, words: list[str]):
        self.next: dict[str, collections.Counter[str]] = collections.defaultdict(collections.Counter)
        for word in words:
            units = ["^", *tokens(word), "$"]
            for a, b in zip(units, units[1:]):
                self.next[a][b] += 1

    def score(self, word: str) -> float:
        """Mean log-probability per transition — higher reads more like Arabic."""
        units = ["^", *tokens(word), "$"]
        logs = [math.log(self.next[a][b] / sum(self.next[a].values())) for a, b in zip(units, units[1:])]
        return sum(logs) / len(logs)

    def sample(self, allowed: set[str], rng: random.Random, max_len: int = 5) -> str | None:
        units: list[str] = []
        current = "^"
        while len(units) <= max_len:
            options = {u: c for u, c in self.next[current].items() if u in allowed or u == "$"}
            if len(units) < 2:
                options.pop("$", None)
            if not options:
                return None
            current = rng.choices(list(options), weights=list(options.values()))[0]
            if current == "$":
                return "".join(units)
            units.append(current)
        return None


def has_letter_run(word: str, length: int = 3) -> bool:
    return any(word[i] == word[i + 1] == word[i + 2] for i in range(len(word) - length + 1))


def pseudo_words(words: list[str], lexicon: set[str]) -> dict[str, list[str]]:
    """Samples many candidates per lesson that lacks real words and keeps the most Arabic-sounding ones."""
    model = BigramModel(words)
    rng = random.Random(42)
    result: dict[str, list[str]] = {}
    known: set[str] = set()
    units = [set(tokens(w)) for w in words]
    for letter in lesson_letters():
        known.add(letter)
        typeable = [u for u in units if u <= known]
        with_letter = sum(1 for u in typeable if letter in u)
        if len(typeable) < MIN_WORDS_FOR_WORD_DRILLS or with_letter >= FULL_REAL_WORD_POOL:
            continue
        candidates: set[str] = set()
        for _ in range(20000):
            word = model.sample(known, rng)
            if word is None or letter not in tokens(word) or has_letter_run(word):
                continue
            if word in lexicon or any(bad in word for bad in PSEUDO_BLOCKLIST):
                continue
            candidates.add(word)
            if len(candidates) >= PSEUDO_CANDIDATES_PER_LESSON:
                break
        best = sorted(candidates, key=model.score, reverse=True)[:PSEUDO_WORDS_PER_LESSON]
        result[letter] = sorted(best)
    return result


def print_coverage(words: list[str], pseudo: dict[str, list[str]]) -> None:
    """Real words available per letter lesson: total / containing the new letter."""
    units = [set(tokens(w)) for w in words]
    known: set[str] = set()
    print("\ncoverage per letter lesson (real words total / with new letter / pseudo-words):")
    for letter in lesson_letters():
        known.add(letter)
        typeable = [u for u in units if u <= known]
        with_letter = sum(1 for u in typeable if letter in u)
        flag = (
            "  <- patterns"
            if len(typeable) < MIN_WORDS_FOR_WORD_DRILLS
            else "  <- pseudo-words"
            if with_letter < FULL_REAL_WORD_POOL
            else ""
        )
        print(f"  {letter}\t{len(typeable)}\t{with_letter}\t{len(pseudo.get(letter, []))}{flag}")


def ts_string_array(items: list[str]) -> str:
    return "[" + ", ".join(f'"{w}"' for w in items) + "]"


def main() -> None:
    quran = {w: c for w, c in collections.Counter(normalize(w) for w in quran_words("simple-clean")).items() if c >= MIN_QURAN_COUNT}
    corpus = corpus_counts()
    msa = {w: r for w, r in msa_ranks().items() if corpus[w] >= MIN_CORPUS_COUNT}
    words = rank_words(quran, msa)
    voweled = voweled_words(set(words))

    WORD_LIST_OUT.write_text(
        "\n".join([
            "// Generated by scripts/word-list/build.py — do not edit by hand.",
            "// Sources: Quran text from the Tanzil Project (https://tanzil.net),",
            "// MSA frequency list from Talk In Arabic (https://talkinarabic.com/arabic-words/).",
            "",
            "/** [word (undiacritized), MSA frequency rank or 0, occurrences in the Quran] — most common first. */",
            "export type WordListEntry = [word: string, msaRank: number, quranCount: number];",
            "",
            "export const WORD_LIST: WordListEntry[] = [",
            *(f'  ["{w}", {msa.get(w, 0)}, {quran.get(w, 0)}],' for w in words),
            "];",
            "",
            "/** Fully voweled Quran word forms (bare form in WORD_LIST) — most common first. */",
            "export const VOWELED_WORDS: string[] = [",
            *(f'  "{w}",' for w in voweled),
            "];",
            "",
        ]),
        "utf-8",
    )
    print(f"{len(words)} words, {len(voweled)} voweled forms -> {WORD_LIST_OUT.relative_to(ROOT)}")

    lexicon = set(corpus) | {normalize(w) for w in quran_words("simple-clean")} | set(msa)
    pseudo = pseudo_words(words, lexicon)
    PSEUDO_OUT.write_text(
        "\n".join([
            "// Generated by scripts/word-list/build.py — do not edit by hand.",
            "",
            "/**",
            " * Pronounceable pseudo-words for letter lessons with too few real words: built",
            " * only from letters known at that lesson, each containing its letter, none found",
            " * in the Quran or the Leipzig news/Wikipedia corpora (so none is a real word).",
            " */",
            "export const PSEUDO_WORDS: Record<string, string[]> = {",
            *(f'  "{l}": {ts_string_array(ws)},' for l, ws in pseudo.items()),
            "};",
            "",
        ]),
        "utf-8",
    )
    print(f"{sum(len(v) for v in pseudo.values())} pseudo-words -> {PSEUDO_OUT.relative_to(ROOT)}")
    print_coverage(words, pseudo)


if __name__ == "__main__":
    main()
