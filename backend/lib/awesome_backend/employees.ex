defmodule AwesomeBackend.Employees do
  require Logger
  @moduledoc """
  The Employees context.
  """

  import Ecto.Query, warn: false
  alias AwesomeBackend.Repo

  alias AwesomeBackend.Employees.Employee

  @doc """
  Returns the list of employees.

  ## Examples

      iex> list_employees()
      [%Employee{}, ...]

  """
  def list_employees do
    Repo.all(Employee)
  end

  @doc """
  Gets a single employee.

  Raises `Ecto.NoResultsError` if the Employee does not exist.

  ## Examples

      iex> get_employee!(123)
      %Employee{}

      iex> get_employee!(456)
      ** (Ecto.NoResultsError)

  """
  def get_employee!(id), do: Repo.get!(Employee, id)

  @doc """
  Creates a employee.

  ## Examples

      iex> create_employee(%{field: value})
      {:ok, %Employee{}}

      iex> create_employee(%{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  def create_employee(attrs \\ %{}) do
    # Remove avatar and direct_reports from attrs since we'll calculate them automatically
    attrs = Map.delete(attrs, "avatar")
    attrs = Map.delete(attrs, "direct_reports")

    # Store the parent_id for later use
    parent_id = Map.get(attrs, "parent_id")

    result = %Employee{}
    |> Employee.changeset(attrs)
    |> Repo.insert()

    case result do
      {:ok, employee} ->
        # Set the avatar to the identicon URL using the employee's ID
        employee
        |> Employee.changeset(%{"avatar" => "/api/identicon/#{employee.id}"})
        |> Repo.update()
        |> case do
          {:ok, updated_employee} ->
            # Update the parent's direct reports count
            if parent_id do
              update_direct_reports_count(parent_id)
            end

            Logger.info("AUDIT: create_employee id=#{updated_employee.id} at #{DateTime.utc_now()}")
            {:ok, updated_employee}
          error -> error
        end
      other -> other
    end
  end

  @doc """
  Updates a employee.

  ## Examples

      iex> update_employee(employee, %{field: new_value})
      {:ok, %Employee{}}

      iex> update_employee(employee, %{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  def update_employee(%Employee{} = employee, attrs) do
    # If avatar is not provided or is empty, generate a new identicon URL
    attrs =
      if Map.get(attrs, "avatar") in [nil, ""] do
        Map.put(attrs, "avatar", "/api/identicon/#{employee.id}")
      else
        attrs
      end

    # Remove direct_reports from attrs since we'll calculate it automatically
    attrs = Map.delete(attrs, "direct_reports")

    # Store the old and new parent_id for later comparison
    old_parent_id = employee.parent_id
    new_parent_id = Map.get(attrs, "parent_id")

    result = employee
    |> Employee.changeset(attrs)
    |> Repo.update()
    case result do
      {:ok, employee} ->
        # Update direct reports counts if parent_id changed
        if old_parent_id != new_parent_id do
          update_affected_direct_reports(old_parent_id, new_parent_id)
        end

        Logger.info("AUDIT: update_employee id=#{employee.id} at #{DateTime.utc_now()}")
        {:ok, employee}
      other -> other
    end
  end

  @doc """
  Deletes a employee.

  ## Examples

      iex> delete_employee(employee)
      {:ok, %Employee{}}

      iex> delete_employee(employee)
      {:error, %Ecto.Changeset{}}

  """
  def delete_employee(%Employee{} = employee) do
    # Store the parent_id before deletion
    parent_id = employee.parent_id

    result = Repo.delete(employee)
    case result do
      {:ok, employee} ->
        # Update the parent's direct reports count
        if parent_id do
          update_direct_reports_count(parent_id)
        end

        Logger.info("AUDIT: delete_employee id=#{employee.id} at #{DateTime.utc_now()}")
        {:ok, employee}
      other -> other
    end
  end

  @doc """
  Returns an `%Ecto.Changeset{}` for tracking employee changes.

  ## Examples

      iex> change_employee(employee)
      %Ecto.Changeset{data: %Employee{}}

  """
  def change_employee(%Employee{} = employee, attrs \\ %{}) do
    Employee.changeset(employee, attrs)
  end

  @doc """
  Calculates the number of direct reports for a given employee ID.
  """
  def calculate_direct_reports(employee_id) do
    from(e in Employee, where: e.parent_id == ^employee_id)
    |> Repo.aggregate(:count)
  end

  @doc """
  Updates the direct_reports count for a specific employee.
  """
  def update_direct_reports_count(employee_id) do
    count = calculate_direct_reports(employee_id)

    from(e in Employee, where: e.id == ^employee_id)
    |> Repo.update_all(set: [direct_reports: count])

    count
  end

  @doc """
  Updates direct reports counts for all employees after organizational changes.
  """
  def update_all_direct_reports_counts do
    # Get all employees
    employees = list_employees()

    # Update direct reports count for each employee
    Enum.each(employees, fn employee ->
      update_direct_reports_count(employee.id)
    end)
  end

  @doc """
  Updates direct reports counts for affected employees when parent_id changes.
  """
  def update_affected_direct_reports(old_parent_id, new_parent_id) do
    # Update count for old parent (if any)
    if old_parent_id do
      update_direct_reports_count(old_parent_id)
    end

    # Update count for new parent (if any)
    if new_parent_id do
      update_direct_reports_count(new_parent_id)
    end
  end
end
