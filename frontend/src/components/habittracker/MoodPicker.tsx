import { useMoodLogByDate } from "../../hooks/habittracker/useMoodLog";
import { useMoodLogMutations } from "../../hooks/habittracker/useMoodLogMutations";
import { MOOD_SCALE } from "../../types/habittracker";
import { toIsoDate } from "../../utils/habittracker/datetimeHelpers";

export function MoodPicker() {
  const today = new Date();
  const iso = toIsoDate(today);

  const { data, isLoading } = useMoodLogByDate(today);
  const { setMoodLogMutation } = useMoodLogMutations();

  const savedMood = data?.mood ?? null;

  // While a mutation is in flight, prefer showing the value just clicked
  // rather than the stale fetched value, mirroring the optimistic pattern
  // used in HabitLogCheckbox.
  const pendingMood = setMoodLogMutation.isPending
    ? setMoodLogMutation.variables?.mood
    : undefined;

  const displayedMood = pendingMood ?? savedMood;

  const onSelect = (mood: number) => {
    setMoodLogMutation.mutate({ date: iso, mood });
  };

  return (
    <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
      <h3 className="mb-3 text-sm font-semibold text-foreground">
        How are you feeling today?
      </h3>

      {isLoading ? (
        <p className="text-xs text-muted-foreground">Loading...</p>
      ) : (
        <div className="flex justify-between gap-1">
          {MOOD_SCALE.map((option) => {
            const isSelected = displayedMood === option.value;
            return (
              <button
                key={option.value}
                type="button"
                aria-label={`Mood: ${option.label}`}
                aria-pressed={isSelected}
                disabled={setMoodLogMutation.isPending}
                onClick={() => onSelect(option.value)}
                className={`flex flex-1 flex-col items-center gap-1 rounded-xl border p-2 text-2xl transition-all
                  ${
                    isSelected
                      ? "border-primary bg-primary/10 scale-105"
                      : "border-transparent hover:border-border hover:bg-muted"
                  }
                  ${setMoodLogMutation.isPending ? "opacity-50" : ""}
                `}
              >
                <span>{option.emoji}</span>
                <span className="text-[10px] font-medium text-muted-foreground">
                  {option.label}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {setMoodLogMutation.isError && (
        <p className="mt-2 text-xs text-destructive">
          Couldn't save your mood. Try again.
        </p>
      )}
    </div>
  );
}
