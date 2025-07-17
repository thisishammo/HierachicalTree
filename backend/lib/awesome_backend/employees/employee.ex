defmodule AwesomeBackend.Employees.Employee do
  use Ecto.Schema
  import Ecto.Changeset

  @primary_key {:id, :binary_id, autogenerate: true}
  @foreign_key_type :binary_id
  @derive {Jason.Encoder, only: [
    :id,
    :name,
    :title,
    :location,
    :department,
    :avatar,
    :email,
    :phone,
    :bio,
    :start_date,
    :skills,
    :direct_reports,
    :parent_id,
    :inserted_at,
    :updated_at
  ]}
  schema "employees" do
    field :name, :string
    field :title, :string
    field :location, :string
    field :department, :string
    field :avatar, :string
    field :email, :string
    field :phone, :string
    field :bio, :string
    field :start_date, :date
    field :skills, :string
    field :direct_reports, :integer
    field :parent_id, :binary_id

    timestamps(type: :utc_datetime)
  end

  @departments ~w(director management advisory education operations technical)

  @doc false
  def changeset(employee, attrs) do
    employee
    |> cast(attrs, [:name, :title, :department, :avatar, :email, :phone, :location, :bio, :start_date, :skills, :direct_reports, :parent_id])
    |> validate_required([:name, :title, :department, :email, :phone, :start_date, :skills])
    |> validate_length(:name, max: 100)
    |> validate_length(:title, max: 100)
    |> validate_length(:location, max: 100)
    |> validate_length(:bio, max: 1000)
    |> validate_length(:skills, max: 500)
    |> validate_format(:email, ~r/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/)
    |> validate_format(:phone, ~r/^\+?[0-9\- ]{7,20}$/)
    |> validate_inclusion(:department, @departments)
    |> validate_number(:direct_reports, greater_than_or_equal_to: 0)
    |> update_change(:name, &strip_html/1)
    |> update_change(:title, &strip_html/1)
    |> update_change(:location, &strip_html/1)
    |> update_change(:bio, &strip_html/1)
    |> update_change(:skills, &strip_html/1)
  end

  defp strip_html(nil), do: nil
  defp strip_html(str) when is_binary(str) do
    Regex.replace(~r/<[^>]*>/, str, "")
  end
end
