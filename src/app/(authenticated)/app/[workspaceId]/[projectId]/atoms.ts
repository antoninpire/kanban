import type { Column, SubTask, Tag, TagByTask, Task } from "@/lib/db/schema";
import { atom } from "jotai";

export const addTaskColumnIdAtom = atom<string | null>(null);

export type TaskWithRelations = Task & {
  tagsByTask: (TagByTask & {
    tag: Tag;
  })[];
  subTasks: SubTask[];
};

export const editTaskAtom = atom<TaskWithRelations | null>(null);

export const editColumnAtom = atom<Column | null>(null);
