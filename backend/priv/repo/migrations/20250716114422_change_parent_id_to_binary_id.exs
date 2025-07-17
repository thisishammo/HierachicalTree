defmodule AwesomeBackend.Repo.Migrations.ChangeParentIdToBinaryId do
  use Ecto.Migration

  def change do
    # First, drop the parent_id column
    alter table(:employees) do
      remove :parent_id
    end

    # Then add it back as binary_id
    alter table(:employees) do
      add :parent_id, :binary_id
    end
  end
end
