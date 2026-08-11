import type { ReactNode } from "react";
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { reorderRows } from "@/lib/admin.functions";

function SortableItem({ id, children }: { id: string; children: ReactNode }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={`relative ${isDragging ? "z-10 opacity-80" : ""}`}
    >
      <button
        type="button"
        aria-label="Riordina: trascina o usa le frecce"
        {...attributes}
        {...listeners}
        className="absolute -left-3 top-3 z-10 font-pixel text-xs bg-background border-2 border-foreground px-1.5 py-1 cursor-grab active:cursor-grabbing hover:bg-accent hover:text-accent-foreground hover:border-accent"
      >
        ⠿
      </button>
      {children}
    </div>
  );
}

export function SortableList<T extends { id: string }>({
  table,
  items,
  onReorder,
  renderItem,
  className = "space-y-4",
}: {
  table: string;
  items: T[];
  onReorder: (next: T[]) => void;
  renderItem: (item: T, index: number) => ReactNode;
  className?: string;
}) {
  const persist = useServerFn(reorderRows);
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  async function onDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const from = items.findIndex((i) => i.id === active.id);
    const to = items.findIndex((i) => i.id === over.id);
    if (from < 0 || to < 0) return;
    const next = arrayMove(items, from, to);
    onReorder(next);
    try {
      await persist({ data: { table, ids: next.map((i) => i.id) } });
      toast.success("Ordine aggiornato");
    } catch (e: any) {
      toast.error(e?.message ?? "Reorder failed");
    }
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      modifiers={[restrictToVerticalAxis]}
      onDragEnd={onDragEnd}
    >
      <SortableContext items={items.map((i) => i.id)} strategy={verticalListSortingStrategy}>
        <div className={`${className} pl-4`}>
          {items.map((item, i) => (
            <SortableItem key={item.id} id={item.id}>
              {renderItem(item, i)}
            </SortableItem>
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
