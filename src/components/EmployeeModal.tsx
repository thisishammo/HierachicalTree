import React, { useState } from 'react';
import { X, Mail, Phone, MapPin, Calendar, Users, Award, Pencil, Trash2 } from 'lucide-react';
import { EmployeeData } from '../data/orgData';

interface EmployeeModalProps {
  employee: EmployeeData | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

const EmployeeModal: React.FC<EmployeeModalProps> = ({ employee, isOpen, onClose, onEdit, onDelete }) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  if (!isOpen || !employee) return null;

  // Helper function to normalize skills to array
  const normalizeSkills = (skills: string[] | string | undefined): string[] => {
    if (!skills) return [];
    if (Array.isArray(skills)) return skills;
    return skills.split(',').map(s => s.trim()).filter(s => s.length > 0);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getDepartmentColor = (department: string) => {
    const colors = {
      director: 'from-blue-500 to-blue-600',
      management: 'from-green-500 to-green-600',
      advisory: 'from-pink-500 to-pink-600',
      education: 'from-orange-500 to-orange-600',
      operations: 'from-purple-500 to-purple-600',
      technical: 'from-cyan-500 to-cyan-600',
    };
    return colors[department as keyof typeof colors] || 'from-gray-500 to-gray-600';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-background/80 backdrop-blur-sm" 
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-card border border-border rounded-xl shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className={`bg-gradient-to-r ${getDepartmentColor(employee.department)} p-6 rounded-t-xl text-white relative`}>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-lg transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Edit/Delete Buttons */}
          <div className="absolute top-4 left-4 flex gap-2">
            {onEdit && (
              <button
                onClick={onEdit}
                className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors flex items-center"
                aria-label="Edit employee"
              >
                <Pencil className="w-5 h-5 mr-1" /> Edit
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="p-2 bg-destructive/80 hover:bg-destructive rounded-lg transition-colors flex items-center text-white"
                aria-label="Delete employee"
              >
                <Trash2 className="w-5 h-5 mr-1" /> Delete
              </button>
            )}
          </div>
          
          <div className="flex items-center space-x-4">
            <img 
              src={employee.avatar ? `http://localhost:4000${employee.avatar}` : `http://localhost:4000/api/identicon/${employee.email || employee.label}`}
              alt={employee.label}
              className="w-20 h-20 rounded-full border-4 border-white shadow-lg bg-white"
              onError={(e) => {
                e.currentTarget.src = `http://localhost:4000/api/identicon/${employee.email || employee.label}`;
              }}
            />
            <div>
              <h2 className="text-2xl font-bold">{employee.label}</h2>
              <p className="text-lg opacity-90">{employee.title}</p>
              <p className="text-sm opacity-75 capitalize">{employee.department} Department</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Contact Information */}
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center">
              <Mail className="w-5 h-5 mr-2 text-muted-foreground" />
              Contact Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {employee.email && (
                <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <a 
                      href={`mailto:${employee.email}`}
                      className="text-primary hover:underline"
                    >
                      {employee.email}
                    </a>
                  </div>
                </div>
              )}
              
              {employee.phone && (
                <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <a 
                      href={`tel:${employee.phone}`}
                      className="text-primary hover:underline"
                    >
                      {employee.phone}
                    </a>
                  </div>
                </div>
              )}
              
              {employee.location && (
                <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Location</p>
                    <p className="text-foreground">{employee.location}</p>
                  </div>
                </div>
              )}
              
              {employee.directReports !== undefined && (
                <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
                  <Users className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Direct Reports</p>
                    <p className="text-foreground">{employee.directReports}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Bio */}
          {employee.bio && (
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-3">About</h3>
              <p className="text-muted-foreground leading-relaxed bg-muted/30 p-4 rounded-lg">
                {employee.bio}
              </p>
            </div>
          )}

          {/* Skills */}
          {employee.skills && normalizeSkills(employee.skills).length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center">
                <Award className="w-5 h-5 mr-2 text-muted-foreground" />
                Skills & Expertise
              </h3>
              <div className="flex flex-wrap gap-2">
                {normalizeSkills(employee.skills).map((skill, index) => (
                  <span 
                    key={index}
                    className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm border border-primary/20"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Employment Details */}
          {employee.startDate && (
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-muted-foreground" />
                Employment Details
              </h3>
              <div className="p-3 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground">Start Date</p>
                <p className="text-foreground">{formatDate(employee.startDate)}</p>
              </div>
            </div>
          )}
        </div>

        {/* Delete Confirmation Dialog */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-card border border-border rounded-xl shadow-xl p-8 max-w-sm w-full">
              <h2 className="text-xl font-bold mb-4 flex items-center text-destructive">
                <Trash2 className="w-5 h-5 mr-2" /> Confirm Delete
              </h2>
              <p className="mb-6 text-foreground">Are you sure you want to delete this employee? This action cannot be undone.</p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-4 py-2 border border-border rounded-lg text-foreground hover:bg-muted transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => { setShowDeleteConfirm(false); onDelete && onDelete(); }}
                  className="px-4 py-2 bg-destructive text-white rounded-lg hover:bg-destructive/90 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeModal;