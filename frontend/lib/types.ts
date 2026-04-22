// ABOUTME: TypeScript types matching the backend Pydantic schemas.
// ABOUTME: Keep in sync with backend app/issues/models.py and app/labels/models.py.

export type IssueStatus = "open" | "in_progress" | "closed";
export type IssuePriority = "low" | "medium" | "high";

export interface Label {
  id: string;
  name: string;
  color: string;
}

export interface Issue {
  id: string;
  title: string;
  description: string | null;
  status: IssueStatus;
  priority: IssuePriority;
  creator_id: string;
  created_at: string;
  updated_at: string;
  labels: Label[];
}

export interface IssueCreate {
  title: string;
  description?: string;
  status?: IssueStatus;
  priority?: IssuePriority;
  label_ids?: string[];
}

export interface IssueUpdate {
  title?: string;
  description?: string;
  status?: IssueStatus;
  priority?: IssuePriority;
  label_ids?: string[];
}

export interface LabelCreate {
  name: string;
  color: string;
}
