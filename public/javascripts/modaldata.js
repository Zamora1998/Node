$(document).ready(function () {
  $(".btn-comprar").on("click", function () {
    // Obtén el ID de la aerolínea desde el botón comprar
    const aerolineaId = $(this).data("id");

    // Busca la aerolínea correspondiente por su ID
    const selectedAerolinea = aerolineas.find(
      (aerolinea) => aerolinea._id === aerolineaId
    );

    // Llena los campos del modal con los datos de la aerolínea seleccionada
    $("#modal-aerolinea").text("Aerolínea: " + selectedAerolinea.Aerolinea);
    $("#modal-asiento").text("Asiento: " + selectedAerolinea.Asiento);
    $("#modal-destino").text("Destino: " + selectedAerolinea.Destino);
    $("#modal-fecha-llegada").text(
      "Fecha de Llegada: " + selectedAerolinea.FechaLlegada
    );
    $("#modal-fecha-salida").text(
      "Fecha de Salida: " + selectedAerolinea.FechaSalida
    );
    $("#modal-pais-salida").text(
      "Pais de Salida: " + selectedAerolinea.PaisSalida
    );
    $("#modal-precio").text("Precio: " + selectedAerolinea.Precio);

    // Mostrar el modal
    $(".modal-container").removeClass("hide");
  });

  // Cerrar el modal al hacer clic en el botón de cerrar
  $(".close-btn").on("click", function () {
    $(".modal-container").addClass("hide");
  });
});
