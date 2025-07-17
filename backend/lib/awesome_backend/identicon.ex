defmodule AwesomeBackend.Identicon do
  @moduledoc """
  Generates a simple identicon SVG, based on a string input.
  """

  # Generates an SVG identicon for the given input string
  def generate(input) do
    hash = :crypto.hash(:md5, input) |> :binary.bin_to_list()
    color = generate_color(hash)
    grid = build_grid(hash)
    generate_svg(grid, color)
  end

  defp generate_color(hash) do
    [r, g, b | _] = hash
    "rgb(#{r}, #{g}, #{b})"
  end

  defp build_grid(hash) do
    hash
    |> Enum.drop(3)
    |> Enum.chunk_every(3)
    |> Enum.map(fn row ->
      row ++ Enum.reverse(Enum.take(row, 2))
    end)
    |> List.flatten()
    |> Enum.with_index()
    |> Enum.filter(fn {code, _idx} -> rem(code, 2) == 0 end)
    |> Enum.map(fn {_code, idx} -> idx end)
  end

  defp generate_svg(grid, color) do
    squares = Enum.map_join(grid, "", fn idx ->
      x = rem(idx, 5) * 50
      y = div(idx, 5) * 50
      "<rect x=\"#{x}\" y=\"#{y}\" width=\"50\" height=\"50\" fill=\"#{color}\"/>"
    end)

    """
    <svg xmlns="http://www.w3.org/2000/svg" width="250" height="250" viewBox="0 0 250 250">
      <rect width="250" height="250" fill="white"/>
      #{squares}
    </svg>
    """
  end
end
