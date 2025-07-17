defmodule AwesomeBackendWeb.Router do
  use AwesomeBackendWeb, :router

  pipeline :api do
    plug :accepts, ["json"]
  end

  scope "/api", AwesomeBackendWeb do
    pipe_through :api

    get "/employees", EmployeeController, :index
    get "/employees/:id", EmployeeController, :show
    post "/employees", EmployeeController, :create
    patch "/employees/:id", EmployeeController, :update
    delete "/employees/:id", EmployeeController, :delete
    get "/identicon/:id", EmployeeController, :identicon
    get "/health", EmployeeController, :health
  end

  # Enable Swoosh mailbox preview in development
  if Application.compile_env(:awesome_backend, :dev_routes) do

    scope "/dev" do
      pipe_through [:fetch_session, :protect_from_forgery]

      forward "/mailbox", Plug.Swoosh.MailboxPreview
    end
  end
end
