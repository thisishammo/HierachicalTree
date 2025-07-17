import React, { useState, useEffect } from 'react';
import { X, Plus, User } from 'lucide-react';
import { EmployeeData } from '../data/orgData';

interface AddEmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddEmployee: (employeeData: EmployeeData, parentId: string | null) => void;
  existingNodes: Array<{ id: string; data: EmployeeData }>;
  initialData?: EmployeeData | null;
  initialParentId?: string | null;
}

const AddEmployeeModal: React.FC<AddEmployeeModalProps> = ({ 
  isOpen, 
  onClose, 
  onAddEmployee, 
  existingNodes,
  initialData,
  initialParentId
}) => {
  const [formData, setFormData] = useState({
    label: '',
    title: '',
    department: 'operations',
    email: '',
    phone: '',
    location: '',
    bio: '',
    startDate: '',
    skills: '',
  });
  const [parentId, setParentId] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isOpen && initialData) {
      setFormData({
        label: initialData.label || '',
        title: initialData.title || '',
        department: initialData.department || 'operations',
        email: initialData.email || '',
        phone: initialData.phone || '',
        location: initialData.location || '',
        bio: initialData.bio || '',
        startDate: initialData.startDate || '',
        skills: initialData.skills ? (Array.isArray(initialData.skills) ? initialData.skills.join(', ') : initialData.skills) : '',
      });
      setParentId(initialParentId || '');
    } else if (isOpen) {
      setFormData({
        label: '',
        title: '',
        department: 'operations',
        email: '',
        phone: '',
        location: '',
        bio: '',
        startDate: '',
        skills: '',
      });
      setParentId('');
    }
  }, [isOpen, initialData, initialParentId]);

  if (!isOpen) return null;

  const isEdit = !!initialData;

  const departments = [
    { value: 'director', label: 'Director' },
    { value: 'management', label: 'Management' },
    { value: 'advisory', label: 'Advisory' },
    { value: 'education', label: 'Education' },
    { value: 'operations', label: 'Operations' },
    { value: 'technical', label: 'Technical' },
  ];

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

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    console.log('[DEBUG] Validating form:', { formData, parentId, isEdit, existingNodesLength: existingNodes.length });
    
    if (!formData.label.trim()) {
      newErrors.label = 'Name is required';
    }
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone is required';
    }
    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required';
    }
    if (!formData.skills.trim()) {
      newErrors.skills = 'Skills are required';
    }
    // Only require supervisor if there are existing employees AND this is not an edit operation
    if (existingNodes.length > 0 && !parentId && !isEdit) {
      newErrors.parentId = 'Please select a supervisor';
    }
    
    console.log('[DEBUG] Validation errors:', newErrors);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('[DEBUG] Form submitted, isEdit:', isEdit);
    console.log('[DEBUG] Form data:', formData);
    console.log('[DEBUG] Parent ID:', parentId);
    
    if (!validateForm()) return;

    // Set sensible defaults for required fields
    const today = new Date().toISOString().slice(0, 10);
    const employeeData: EmployeeData = {
      label: formData.label,
      title: formData.title,
      department: formData.department,
      avatar: '', // Let backend assign identicon if not provided
      email: formData.email || 'employee@company.com', // Provide default email
      phone: formData.phone || '+1-555-0000', // Provide default phone
      location: formData.location || '',
      bio: formData.bio || '',
      startDate: formData.startDate || today,
      skills: formData.skills ? formData.skills.split(',').map(s => s.trim()) : ['General'],
    };
    // parentId should be the actual UUID from the backend
    let parentIdValue = null;
    if (existingNodes.length > 0 && parentId) {
      // Extract employee ID from node ID (e.g., 'employee-uuid' -> uuid)
      const employeeId = parentId.replace('employee-', '');
      parentIdValue = employeeId;
    }
    console.log('[DEBUG] Parent ID being sent:', parentIdValue);
    console.log('[DEBUG] Employee data being sent:', employeeData);
    onAddEmployee(employeeData, parentIdValue);
    
    // Reset form
    setFormData({
      label: '',
      title: '',
      department: 'operations',
      email: '',
      phone: '',
      location: '',
      bio: '',
      startDate: '',
      skills: '',
    });
    setParentId('');
    setErrors({});
    onClose();
  };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
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
        <div className="bg-gradient-to-r from-primary to-primary/80 p-6 rounded-t-xl text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-lg transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white/20 rounded-lg">
              <Plus className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">{isEdit ? 'Edit Employee' : 'Add New Employee'}</h2>
              <p className="text-sm opacity-90">{isEdit ? 'Update employee details and reporting structure' : 'Add a new member to the organizational hierarchy'}</p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
              <User className="w-5 h-5 mr-2 text-muted-foreground" />
              Basic Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={formData.label}
                  onChange={(e) => handleInputChange('label', e.target.value)}
                  className={`w-full p-3 border rounded-lg bg-background text-foreground ${
                    errors.label ? 'border-destructive' : 'border-border'
                  }`}
                  placeholder="Enter full name"
                />
                {errors.label && (
                  <p className="text-sm text-destructive mt-1">{errors.label}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Job Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className={`w-full p-3 border rounded-lg bg-background text-foreground ${
                    errors.title ? 'border-destructive' : 'border-border'
                  }`}
                  placeholder="Enter job title"
                />
                {errors.title && (
                  <p className="text-sm text-destructive mt-1">{errors.title}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Department
                </label>
                <select
                  value={formData.department}
                  onChange={(e) => handleInputChange('department', e.target.value)}
                  className="w-full p-3 border border-border rounded-lg bg-background text-foreground"
                >
                  {departments.map(dept => (
                    <option key={dept.value} value={dept.value}>
                      {dept.label}
                    </option>
                  ))}
                </select>
              </div>
              

            </div>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">Contact Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={`w-full p-3 border rounded-lg bg-background text-foreground ${
                    errors.email ? 'border-destructive' : 'border-border'
                  }`}
                  placeholder="Enter email address"
                />
                {errors.email && (
                  <p className="text-sm text-destructive mt-1">{errors.email}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Phone *
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className={`w-full p-3 border rounded-lg bg-background text-foreground ${
                    errors.phone ? 'border-destructive' : 'border-border'
                  }`}
                  placeholder="Enter phone number"
                />
                {errors.phone && (
                  <p className="text-sm text-destructive mt-1">{errors.phone}</p>
                )}
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-foreground mb-2">
                  Location
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  className="w-full p-3 border border-border rounded-lg bg-background text-foreground"
                  placeholder="Enter location"
                />
              </div>
            </div>
          </div>

          {/* Supervisor Selection */}
          {existingNodes.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-4">Reporting Structure</h3>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Reports to *
                </label>
                <select
                  value={parentId}
                  onChange={(e) => {
                    setParentId(e.target.value);
                    if (errors.parentId) {
                      setErrors(prev => ({ ...prev, parentId: '' }));
                    }
                  }}
                  className={`w-full p-3 border rounded-lg bg-background text-foreground ${
                    errors.parentId ? 'border-destructive' : 'border-border'
                  }`}
                >
                  <option value="">Select a supervisor</option>
                  {existingNodes.map(node => (
                    <option key={node.id} value={node.id}>
                      {node.data.label} - {node.data.title}
                    </option>
                  ))}
                </select>
                {errors.parentId && (
                  <p className="text-sm text-destructive mt-1">{errors.parentId}</p>
                )}
              </div>
            </div>
          )}

          {/* Additional Information */}
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">Additional Information</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Bio
                </label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => handleInputChange('bio', e.target.value)}
                  className="w-full p-3 border border-border rounded-lg bg-background text-foreground"
                  rows={3}
                  placeholder="Enter employee bio"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Skills (comma-separated) *
                </label>
                <input
                  type="text"
                  value={formData.skills}
                  onChange={(e) => handleInputChange('skills', e.target.value)}
                  className={`w-full p-3 border rounded-lg bg-background text-foreground ${
                    errors.skills ? 'border-destructive' : 'border-border'
                  }`}
                  placeholder="e.g., Leadership, Communication, Project Management"
                />
                {errors.skills && (
                  <p className="text-sm text-destructive mt-1">{errors.skills}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Start Date *
                </label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => handleInputChange('startDate', e.target.value)}
                  className={`w-full p-3 border rounded-lg bg-background text-foreground ${
                    errors.startDate ? 'border-destructive' : 'border-border'
                  }`}
                />
                {errors.startDate && (
                  <p className="text-sm text-destructive mt-1">{errors.startDate}</p>
                )}
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-border">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-border rounded-lg text-foreground hover:bg-muted transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>{isEdit ? 'Save Changes' : 'Add Employee'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEmployeeModal; 