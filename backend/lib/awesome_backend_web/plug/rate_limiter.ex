defmodule AwesomeBackendWeb.Plug.RateLimiter do
  use PlugAttack

  rule "throttle by ip", conn do
    ip = Tuple.to_list(conn.remote_ip) |> Enum.join(".")
    throttle(ip, period: 60_000, limit: 60, storage: {PlugAttack.Storage.Ets, __MODULE__.Storage})
  end

  def block_action(conn, _opts) do
    conn
    |> Plug.Conn.send_resp(429, "Too many requests")
    |> Plug.Conn.halt()
  end
end
