defmodule AwesomeBackendWeb.Endpoint do
  use Phoenix.Endpoint, otp_app: :awesome_backend

  # The session will be stored in the cookie and signed,
  # this means its contents can be read but not tampered with.
  # Set :encryption_salt if you would also like to encrypt it.
  @session_options [
    store: :cookie,
    key: "_awesome_backend_key",
    signing_salt: "VoOLvVfZ",
    same_site: "Lax"
  ]

  # socket "/live", Phoenix.LiveView.Socket,
  #   websocket: [connect_info: [session: @session_options]],
  #   longpoll: [connect_info: [session: @session_options]]

  # Serve at "/" the static files from "priv/static" directory.
  #
  # You should set gzip to true if you are running phx.digest
  # when deploying your static files in production.
  plug Plug.Static,
    at: "/",
    from: :awesome_backend,
    gzip: false,
    only: AwesomeBackendWeb.static_paths()

  # Code reloading can be explicitly enabled under the
  # :code_reloader configuration of your endpoint.
  if code_reloading? do
    plug Phoenix.CodeReloader
  end

  plug Plug.RequestId
  plug Plug.Telemetry, event_prefix: [:phoenix, :endpoint]

  plug Plug.Parsers,
    parsers: [:urlencoded, :multipart, :json],
    pass: ["*/*"],
    json_decoder: Phoenix.json_library()

  plug CORSPlug, origin: ["http://localhost:5173", "http://localhost:8080"]
  plug Plug.MethodOverride
  plug Plug.Head
  plug Plug.Session, @session_options
  plug AwesomeBackendWeb.Plug.RateLimiter
  plug :put_secure_headers
  plug AwesomeBackendWeb.Router

  defp put_secure_headers(conn, _opts) do
    Plug.Conn.register_before_send(conn, fn conn ->
      conn
      |> Plug.Conn.put_resp_header("x-frame-options", "DENY")
      |> Plug.Conn.put_resp_header("x-xss-protection", "1; mode=block")
      |> Plug.Conn.put_resp_header("x-content-type-options", "nosniff")
      |> Plug.Conn.put_resp_header("referrer-policy", "strict-origin-when-cross-origin")
      |> Plug.Conn.put_resp_header("content-security-policy", "default-src 'self'")
    end)
  end
end
