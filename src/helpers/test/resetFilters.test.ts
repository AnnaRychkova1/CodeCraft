import { resetFilters } from "@/helpers/resetFiltersHelper";

describe("resetFilters", () => {
  it("calls all setters with empty arrays", () => {
    const setLevel = jest.fn();
    const setLanguage = jest.fn();
    const setType = jest.fn();
    const setCompletion = jest.fn();

    resetFilters(setLevel, setLanguage, setType, setCompletion);

    expect(setLevel).toHaveBeenCalledWith([]);
    expect(setLanguage).toHaveBeenCalledWith([]);
    expect(setType).toHaveBeenCalledWith([]);
    expect(setCompletion).toHaveBeenCalledWith([]);
  });
});
