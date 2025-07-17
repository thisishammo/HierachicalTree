defmodule AwesomeBackend.Repo do
  use Ecto.Repo,
    otp_app: :awesome_backend,
    adapter: Ecto.Adapters.Postgres
end
