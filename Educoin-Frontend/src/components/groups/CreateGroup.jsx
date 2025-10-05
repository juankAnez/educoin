"use client";

import { useState, useEffect } from "react";
import { useCreateGroup, useUpdateGroup } from "../../hooks/useGroups";
import { validateGroupForm } from "../../utils/validators";
import LoadingSpinner from "../common/LoadingSpinner";

const CreateGroup = ({ group, onClose }) => {
  const createGroup = useCreateGroup();
  const updateGroup = useUpdateGroup();
  const isEditing = !!group;

  const [formData, setFormData] = useState({
    name: "",
    code: "", // Código único para que los estudiantes se unan
    max_students: 30,
    coin_limit: 1000,
    start_date: "",
    end_date: "",
    is_closed: false,
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (group) {
      setFormData({
        name: group.name || "",
        code: group.code || "",
        max_students: group.max_students || 30,
        coin_limit: group.coin_limit || 1000,
        start_date: group.start_date || "",
        end_date: group.end_date || "",
        is_closed: group.is_closed || false,
      });
    }
  }, [group]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : type === "number" ? parseInt(value) || 0 : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validation = validateGroupForm(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    try {
      if (isEditing) {
        await updateGroup.mutateAsync({ id: group.id, data: formData });
      } else {
        await createGroup.mutateAsync(formData);
      }
      onClose();
    } catch (error) {}
  };

  const isLoading = createGroup.isPending || updateGroup.isPending;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="label">Nombre del Grupo</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="input"
          required
        />
      </div>

      <div>
        <label htmlFor="code" className="label">Código del Grupo</label>
        <input
          type="text"
          id="code"
          name="code"
          value={formData.code}
          onChange={handleChange}
          className="input"
          placeholder="Ej: MATH-10A-2025"
          required
        />
        <p className="text-xs text-gray-500">Los estudiantes usarán este código para unirse.</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="max_students" className="label">Máximo de Estudiantes</label>
          <input
            type="number"
            id="max_students"
            name="max_students"
            value={formData.max_students}
            onChange={handleChange}
            className="input"
          />
        </div>

        <div>
          <label htmlFor="coin_limit" className="label">Límite de Educoins</label>
          <input
            type="number"
            id="coin_limit"
            name="coin_limit"
            value={formData.coin_limit}
            onChange={handleChange}
            className="input"
          />
        </div>
      </div>

      <div className="flex space-x-3 pt-4">
        <button type="button" onClick={onClose} className="btn-secondary flex-1">Cancelar</button>
        <button type="submit" disabled={isLoading} className="btn-primary flex-1">
          {isLoading ? <LoadingSpinner size="sm" /> : isEditing ? "Actualizar" : "Crear Grupo"}
        </button>
      </div>
    </form>
  );
};

export default CreateGroup;
