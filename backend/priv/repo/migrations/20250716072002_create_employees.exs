defmodule AwesomeBackend.Repo.Migrations.CreateEmployees do
  use Ecto.Migration

  def change do
    create table(:employees, primary_key: false) do
      add :id, :binary_id, primary_key: true
      add :name, :string
      add :title, :string
      add :department, :string
      add :avatar, :string
      add :email, :string
      add :phone, :string
      add :location, :string
      add :bio, :string
      add :start_date, :date
      add :skills, :string
      add :direct_reports, :integer
      add :parent_id, :integer

      timestamps(type: :utc_datetime)
    end
  end
end
