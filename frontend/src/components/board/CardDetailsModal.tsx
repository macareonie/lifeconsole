import type { Card } from "../../types/kanban";
import { Button } from "../ui/button";
import { useCardMutations } from "../../hooks/kanban/useCardMutations";
import { CardEditForm } from "./forms/CardEditForm";
import { DeleteConfirmButton } from "./forms/DeleteConfirmButton";
import type { CardSubmissionValues } from "./forms/CardEditForm";

export function CardDetailsModal({
  card,
  board_id,
  onClose,
}: {
  card: Card;
  board_id: number;
  onClose: () => void;
}) {
  const { updateCardMutation, deleteCardMutation } = useCardMutations();

  const onSave = async ({
    title,
    subtitle,
    metadata,
  }: CardSubmissionValues) => {
    await updateCardMutation.mutateAsync({
      board_id,
      card_id: card.id,
      title,
      subtitle,
      column_id: card.column_id,
      position: card.position,
      metadata: metadata,
    });
    onClose();
  };

  const onDelete = async () => {
    await deleteCardMutation.mutateAsync({ board_id, card_id: card.id });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-2xl border border-border bg-card p-6 text-card-foreground shadow-xl">
        <div className="mb-4 flex items-start justify-between">
          <div>
            <h2 className="text-lg font-bold">{card.title}</h2>
          </div>

          <Button type="button" onClick={onClose} variant="ghost" size="sm">
            Close
          </Button>
        </div>

        <div className="space-y-4">
          <CardEditForm
            card_id={card.id}
            initialTitle={card.title}
            initialSubtitle={card.subtitle ?? ""}
            initialMetadata={card.metadata ?? {}}
            isPending={updateCardMutation.isPending}
            errorMessage={
              updateCardMutation.isError
                ? updateCardMutation.error.message
                : undefined
            }
            onSubmit={onSave}
            onCancel={onClose}
          />

          {card.metadata && typeof card.metadata === "object" && (
            <div className="space-y-2 rounded-lg border border-border bg-muted/40 p-3">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Current metadata
              </p>
              {Object.entries(card.metadata).map(([field, value]) => (
                <div key={field} className="rounded-lg bg-background p-3">
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    {field}
                  </p>
                  <p className="mt-1 text-sm text-foreground">
                    {String(value)}
                  </p>
                </div>
              ))}
            </div>
          )}

          <DeleteConfirmButton
            confirmMessage={`Delete card "${card.title}"?`}
            label="Delete card"
            pendingLabel="Deleting..."
            isPending={deleteCardMutation.isPending}
            onConfirm={onDelete}
            size="sm"
          />

          {deleteCardMutation.isError && (
            <p className="text-sm text-destructive">
              {deleteCardMutation.error.message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
