import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { EmployeeData } from '../data/orgData';

interface OrganizationalNodeData extends EmployeeData {}

interface OrganizationalNodeProps {
  data: OrganizationalNodeData;
  onClick?: () => void;
}

const OrganizationalNode = memo(({ data, onClick }: OrganizationalNodeProps) => {
  return (
    <div 
      className={`org-node org-node-${data.department} cursor-pointer hover:scale-105 transition-transform duration-200`}
      onClick={onClick}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 bg-blue-500 border-2 border-white rounded-full hover:bg-blue-600 transition-colors"
        style={{ opacity: 0.8 }}
      />
      
      <img 
        src={data.avatar ? `http://localhost:4000${data.avatar}` : `http://localhost:4000/api/identicon/${data.email || data.label}`}
        alt={data.label}
        className="org-node-avatar object-cover"
        onError={(e) => {
          e.currentTarget.src = `http://localhost:4000/api/identicon/${data.email || data.label}`;
        }}
      />
      
      <div className="org-node-label">
        <div className="font-medium">{data.label}</div>
        <div className="text-xs opacity-90">{data.title}</div>
        {data.department && (
          <div className="text-xs opacity-70 capitalize mt-1 px-2 py-1 bg-gray-100 rounded-full">
            {data.department}
          </div>
        )}
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3 h-3 bg-green-500 border-2 border-white rounded-full hover:bg-green-600 transition-colors"
        style={{ opacity: 0.8 }}
      />
    </div>
  );
});

OrganizationalNode.displayName = 'OrganizationalNode';

export default OrganizationalNode;