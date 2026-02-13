import { SuggestionService } from "../src/suggestionService";

describe("SuggestionService", () => {
    const service = new SuggestionService();

    it("should return exactly maxSuggestions results when available", () => {
        const suggestions = service.getSuggestions("gros", ["gros", "gras", "graisse", "agressif", "go", "ros", "gro"], 2);
        expect(suggestions).toHaveLength(2);
        expect(suggestions[0]).toBe("gros");
        expect(suggestions[1]).toBe("gras");
    });

    it("should exclude non-similar words (Infinity scores)", () => {
        const noSimilar = service.getSuggestions("abc", ["x", "yy", "zz"], 3);
        expect(noSimilar).toEqual([]);
    });

    it("maxSuggestions = 0 should return an empty array", () => {
        const zeroSuggestions = service.getSuggestions("gros", ["gros", "gras"], 0);
        expect(zeroSuggestions).toEqual([]);
    });

    it("empty choices should return empty array", () => {
        const emptyChoices = service.getSuggestions("gros", [], 3);
        expect(emptyChoices).toEqual([]);
    });

    it("should return only available finite matches", () => {
        const moreThanAvailable = service.getSuggestions("gros", ["gros", "gras", "graisse", "agressif", "go", "ros", "gro"], 10);
        expect(moreThanAvailable).toEqual(["gros", "gras", "agressif", "graisse"]);
    });

    it("should sort alphabetically when score and length are equal", () => {
        const alphabeticalTie = service.getSuggestions("abcd", ["abcf", "abce"], 2);
        expect(alphabeticalTie).toEqual(["abce", "abcf"]);
    });

    it("should prefer shorter term when scores are equal", () => {
        const lengthTieBreak = service.getSuggestions("gros", ["agressif", "gras"], 2);
        expect(lengthTieBreak).toEqual(["gras", "agressif"]);
    });

    it("substring match not at index 0 should score 0", () => {
        expect(service.getDifferenceScore("xxgrosyy", "gros")).toBe(0);
    });
});
