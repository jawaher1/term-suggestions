export class SuggestionService {

    getSuggestions(term: string, choices: string[], maxSuggestions: number) {
        const scoredChoices = choices.map(choice => ({
            choice,
            score: this.getDifferenceScore(choice, term)
        }));
        // sort per score ascending, then by length ascending, then alphabetically
        scoredChoices.sort((a, b) => {
            if (a.score !== b.score) return a.score - b.score;
            if (a.choice.length !== b.choice.length) return a.choice.length - b.choice.length;
            return a.choice.localeCompare(b.choice);
        });
        return scoredChoices
            .filter(scored => Number.isFinite(scored.score)) // exclude non-similar choices (score = Infinity)
            .slice(0, maxSuggestions)
            .map(scored => scored.choice);
    }

    getDifferenceScore(src: string, dest: string): number {
        const len = dest.length;
        if (src.length < len) return Infinity; // not long enough to contain dest, so not similar
        let minScore = Infinity;

        for (let i = 0; i <= src.length - len; i++) { // Iterate over substrings of src of the same length as dest
            let score = 0;
            for (let j = 0; j < len; j++) {
                if (src[i + j] !== dest[j]) score++; // Increment score for each differing character
            }
            if (score < minScore) minScore = score; // Keep the minimum score found for this choice
        }

        return minScore;
    }
}