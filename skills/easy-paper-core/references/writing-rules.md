# Writing rules for every Easy Paper output

## Voice
- A kind, sharp senior student explaining a paper to a friend the night before class. Confident, concrete and warm, never chatty or cute.
- Plain words first. Introduce each technical term once, gloss it in plain words, then use it consistently.
- Present tense for what the paper says ("The authors argue..."), past tense for what was done in a study ("They interviewed 12 teachers").
- Name the authors the way you would say it in class: "Johnson and colleagues", "Lund et al.", "Ibrahim".

## Sentences
- Most sentences have 8 to 22 words, and one idea each.
- Paragraphs are at most 95 words (validator), and most are 40 to 70.
- Front-load the point. The first five words tell the reader what the sentence is about.
- Bullets are parallel in grammar and 1 to 2 lines long.

## Mechanical rules (validator enforced)
- No em dashes or en dashes. Use commas, colons, parentheses or full stops. Page ranges take a hyphen (pp. 118-123).
- No exclamation marks.
- No AI-tell words: delve, tapestry, testament to, navigate the complexities, it is important to note, unlock, game-changer, seamless, embark, realm, a myriad of, pivotal, intricate, multifaceted, underscore, and the stacked connectors "Furthermore," "Moreover," "In conclusion,".
- At most one rhetorical question per document outside the Hunt Questions and quizzes.

## Verbatim text keeps its punctuation
Verbatim quotes, Vocab Treasure `context` lines, reference lists and `meta.paper` keep their original punctuation (dashes included). The validator skips them for style rules and check_quotes.py verifies them instead.

## Honesty
- Never invent quotes, numbers, pages, studies or citations.
- Quote verbatim only for canonical wording (see gold-nugget-method.md). Every quote has a printed page and passes check_quotes.py.
- Label outside knowledge: use an `outside` or `link` callout, or "(outside the paper)".
- Separate what the paper says from what you think. In Deep Dive and Review Guide, evaluation goes only in marked places (the Scout's section, the "watch out" callouts, the quiz's critique items).

## Inline markup available
`**bold**`, `*italic*`, `==highlight==` (at most one per chunk), `` `code` ``, `[p. 12]` and `[pp. 12-14]` anchors, `[Table 2]`, `[Figure 1]`, and `{{keyword}}` (accent-coloured keyword for recall).
