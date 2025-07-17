import { Node, Edge, MarkerType } from '@xyflow/react';

export interface EmployeeData {
  label: string;
  title: string;
  department: string;
  avatar: string;
  email?: string;
  phone?: string;
  location?: string;
  bio?: string;
  startDate?: string;
  skills?: string[] | string;
  directReports?: number;
}