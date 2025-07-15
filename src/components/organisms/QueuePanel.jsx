import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const SortableQueueItem = ({ song, currentSong, onPlay, onRemove }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: song.Id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const isCurrentSong = currentSong?.Id === song.Id;

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "sortable-item",
        isDragging && "dragging"
      )}
      {...attributes}
    >
      <Card className={cn(
        "p-3 mb-2 cursor-pointer transition-all duration-200",
        isCurrentSong && "border-primary bg-primary/10"
      )}>
        <div className="flex items-center gap-3">
          <div
            {...listeners}
            className="cursor-grab active:cursor-grabbing p-1 hover:bg-gray-700 rounded"
          >
            <ApperIcon name="GripVertical" size={16} className="text-gray-400" />
          </div>
          
          <img
            src={song.coverUrl}
            alt={song.title}
            className="w-10 h-10 rounded-lg object-cover"
          />
          
          <div className="flex-1 min-w-0" onClick={() => onPlay(song)}>
            <h4 className={cn(
              "font-medium truncate",
              isCurrentSong ? "text-primary" : "text-white"
            )}>
              {song.title}
            </h4>
            <p className="text-sm text-gray-400 truncate">
              {song.artist} • {formatTime(song.duration)}
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            {isCurrentSong && (
              <ApperIcon name="Volume2" size={16} className="text-primary" />
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onRemove(song.Id)}
              className="w-8 h-8 text-gray-400 hover:text-red-400"
            >
              <ApperIcon name="X" size={14} />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

const QueuePanel = ({ 
  queue, 
  currentSong, 
  onPlay, 
  onRemoveFromQueue, 
  onReorderQueue,
  onClose 
}) => {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      const oldIndex = queue.findIndex((item) => item.Id === active.id);
      const newIndex = queue.findIndex((item) => item.Id === over.id);
      
      const newQueue = arrayMove(queue, oldIndex, newIndex);
      onReorderQueue(newQueue);
    }
  };

  return (
    <motion.div
      initial={{ y: "100%", opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: "100%", opacity: 0 }}
      transition={{ type: "spring", damping: 30, stiffness: 300 }}
      className="fixed bottom-0 left-0 right-0 z-40 bg-background/95 backdrop-blur-md border-t border-gray-700 max-h-[70vh] overflow-hidden"
    >
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">Queue ({queue.length})</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="w-8 h-8 text-gray-400 hover:text-white"
          >
            <ApperIcon name="X" size={16} />
          </Button>
        </div>
        
        {queue.length === 0 ? (
          <div className="text-center py-8">
            <ApperIcon name="Music" size={48} className="text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">No songs in queue</p>
            <p className="text-sm text-gray-500 mt-1">Add songs to start building your queue</p>
          </div>
        ) : (
          <div className="max-h-[50vh] overflow-y-auto pr-2">
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext items={queue.map(song => song.Id)} strategy={verticalListSortingStrategy}>
                {queue.map((song) => (
                  <SortableQueueItem
                    key={song.Id}
                    song={song}
                    currentSong={currentSong}
                    onPlay={onPlay}
                    onRemove={onRemoveFromQueue}
                  />
                ))}
              </SortableContext>
            </DndContext>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default QueuePanel;