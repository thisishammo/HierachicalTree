defmodule AwesomeBackendWeb.EmployeeController do
  use AwesomeBackendWeb, :controller

  def index(conn, _params) do
    employees = AwesomeBackend.Employees.list_employees()
    json(conn, employees)
  end

  def show(conn, %{"id" => id}) do
    case AwesomeBackend.Employees.get_employee!(id) do
      nil -> send_resp(conn, 404, "Not found")
      employee -> json(conn, employee)
    end
  end

  def create(conn, params) do
    IO.inspect(params, label: "[DEBUG] Received params in create")
    case AwesomeBackend.Employees.create_employee(params) do
      {:ok, employee} ->
        conn
        |> put_status(:created)
        |> json(employee)
      {:error, %Ecto.Changeset{} = changeset} ->
        IO.inspect(changeset.errors, label: "[DEBUG] Changeset errors in create")
        conn
        |> put_status(:unprocessable_entity)
        |> json(%{errors: Ecto.Changeset.traverse_errors(changeset, fn {msg, opts} ->
          Enum.reduce(opts, msg, fn {key, value}, acc ->
            String.replace(acc, "%{#{key}}", to_string(value))
          end)
        end)})
    end
  end

  def update(conn, %{"id" => id} = params) do
    case AwesomeBackend.Employees.get_employee!(id) do
      nil -> send_resp(conn, 404, "Not found")
      employee ->
        case AwesomeBackend.Employees.update_employee(employee, params) do
          {:ok, employee} -> json(conn, employee)
          {:error, %Ecto.Changeset{} = changeset} ->
            conn
            |> put_status(:unprocessable_entity)
            |> json(%{errors: Ecto.Changeset.traverse_errors(changeset, fn {msg, opts} ->
              Enum.reduce(opts, msg, fn {key, value}, acc ->
                String.replace(acc, "%{#{key}}", to_string(value))
              end)
            end)})
        end
    end
  end

  def delete(conn, %{"id" => id}) do
    case AwesomeBackend.Employees.get_employee!(id) do
      nil -> send_resp(conn, 404, "Not found")
      employee ->
        case AwesomeBackend.Employees.delete_employee(employee) do
          {:ok, _} -> send_resp(conn, 204, "")
          {:error, _} -> send_resp(conn, 500, "Failed to delete employee")
        end
    end
  end

  def identicon(conn, %{"id" => id}) do
    svg = AwesomeBackend.Identicon.generate(id)
    conn
    |> put_resp_content_type("image/svg+xml")
    |> send_resp(200, svg)
  end

  def health(conn, _params) do
    json(conn, %{status: "ok"})
  end
end
