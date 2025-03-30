import { secondsToDayJs } from "./TimeUtils";

describe("secondsToDayJs", () => {
    test("should convert 3661 seconds correctly (1 hour, 1 minute, 1 second)", () => {
        const result = secondsToDayJs(3661);
        expect(result.hour()).toBe(1);
        expect(result.minute()).toBe(1);
        expect(result.second()).toBe(1);
    });

    test("should convert 0 seconds to 00:00:00", () => {
        const result = secondsToDayJs(0);
        expect(result.hour()).toBe(0);
        expect(result.minute()).toBe(0);
        expect(result.second()).toBe(0);
    });

    test("should convert 3600 seconds to 01:00:00", () => {
        const result = secondsToDayJs(3600);
        expect(result.hour()).toBe(1);
        expect(result.minute()).toBe(0);
        expect(result.second()).toBe(0);
    });

    test("should convert 86399 seconds to 23:59:59", () => {
        const result = secondsToDayJs(86399);
        expect(result.hour()).toBe(23);
        expect(result.minute()).toBe(59);
        expect(result.second()).toBe(59);
    });

    test("should convert 43200 seconds to 12:00:00", () => {
        const result = secondsToDayJs(43200);
        expect(result.hour()).toBe(12);
        expect(result.minute()).toBe(0);
        expect(result.second()).toBe(0);
    });
});