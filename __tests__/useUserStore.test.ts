import { useUserStore } from "@/store/useUserStore";

describe("useUserStore", () => {
  beforeEach(() => {
    useUserStore.getState().resetProgress();
  });

  it("adds XP and updates level", () => {
    useUserStore.getState().addXP(120);
    const { totalXP, level } = useUserStore.getState().progress;

    expect(totalXP).toBe(120);
    expect(level).toBe(2);
  });

  it("does not reduce hearts below zero", () => {
    for (let i = 0; i < 10; i += 1) {
      useUserStore.getState().loseHeart();
    }

    expect(useUserStore.getState().progress.hearts).toBe(0);
  });
});
