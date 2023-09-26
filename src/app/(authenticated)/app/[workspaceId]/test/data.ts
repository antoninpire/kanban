import { createId } from "@paralleldrive/cuid2";

export const data = [
  {
    id: "1",
    Task: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent.",
    // Assigned_To: 'Beltran',
    // Assignee: 'Romona',
    // Status: 'To-do',
    // Priority: 'Low',
    Due_Date: "25-May-2020",
  },
  {
    id: "2",
    Task: "Fix Styling",
    // Assigned_To: 'Dave',
    // Assignee: 'Romona',
    // Status: 'To-do',
    // Priority: 'Low',
    Due_Date: "26-May-2020",
  },
  {
    id: "3",
    Task: "Handle Door Specs",
    // Assigned_To: 'Roman',
    // Assignee: 'Romona',
    // Status: 'To-do',
    // Priority: 'Low',
    Due_Date: "27-May-2020",
  },
  {
    id: "4",
    Task: "morbi",
    // Assigned_To: 'Gawen',
    // Assignee: 'Kai',
    // Status: 'Done',
    // Priority: 'High',
    Due_Date: "23-Aug-2020",
  },
  {
    id: "5",
    Task: "proin",
    // Assigned_To: 'Bondon',
    // Assignee: 'Antoinette',
    // Status: 'In Progress',
    // Priority: 'Medium',
    Due_Date: "05-Jan-2021",
  },
];

export const columnsFromBackend = {
  [createId()]: {
    title: "To-do",
    items: data,
  },
  [createId()]: {
    title: "In Progress",
    items: [],
  },
  [createId()]: {
    title: "Done",
    items: [],
  },
};

export const columnsData = [
  {
    id: createId(),
    title: "To-do",
    items: data,
  },
  {
    id: createId(),
    title: "In Progress",
    items: [],
  },
  {
    id: createId(),
    title: "Done",
    items: [],
  },
];
