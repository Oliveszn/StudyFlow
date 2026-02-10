"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import SectionCard from "./SectionCard";
import AddSectionDialog from "./AddSectionDialog";
import { useReorderSections } from "@/hooks/endpoints/instructor/useSection";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

interface Section {
  id: string;
  title: string;
  description?: string;
  order: number;
  _count: {
    lessons: number;
  };
}

interface SectionListProps {
  courseId: string;
  sections: Section[];
}

export default function SectionList({ courseId, sections }: SectionListProps) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const { mutate: reorderSections } = useReorderSections();
  const [items, setItems] = useState(
    [...sections].sort((a, b) => a.order - b.order),
  );

  const onDragEnd = (result: any) => {
    if (!result.destination) return;

    const reordered = Array.from(items);
    const [moved] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, moved);

    ///updating order immediately on the ui
    const withUpdatedOrder = reordered.map((section, index) => ({
      ...section,
      order: index + 1,
    }));

    setItems(withUpdatedOrder);

    //////sending minimal order to backend
    reorderSections({
      courseId,
      form: {
        sectionOrders: withUpdatedOrder.map((s) => ({
          sectionId: s.id,
          order: s.order,
        })),
      },
    });
  };

  return (
    <div className="space-y-4">
      <button
        onClick={() => setIsAddDialogOpen(true)}
        className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition text-gray-600 hover:text-blue-600"
      >
        <Plus className="w-5 h-5" />
        <span className="font-medium">Add Section</span>
      </button>

      {items.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <p className="text-gray-500">
            No sections yet. Add your first section to get started.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="sections">
              {(provided) => (
                <div ref={provided.innerRef} {...provided.droppableProps}>
                  {items.map((section, index) => (
                    <Draggable
                      key={section.id}
                      draggableId={section.id}
                      index={index}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          style={provided.draggableProps.style}
                        >
                          <SectionCard
                            key={section.id}
                            section={section}
                            courseId={courseId}
                            index={index}
                            totalSections={items.length}
                            dragHandleProps={provided.dragHandleProps}
                          />
                        </div>
                      )}
                    </Draggable>
                  ))}

                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>
      )}

      <AddSectionDialog
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        courseId={courseId}
      />
    </div>
  );
}
