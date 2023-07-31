$(document).ready(function () {
  $(".btn-comprar").on("click", function () {
    const aerolineaId = $(this).data("id");
    const selectedAerolinea = aerolineas.find(
      (aerolinea) => aerolinea._id === aerolineaId
    );

    // Actualizar el contenido del modal con los detalles del vuelo seleccionado
    $("#modalAerolinea").text(selectedAerolinea.Aerolinea);
    $("#modalAsiento").text(selectedAerolinea.Asiento);
    $("#modalDestino").text(selectedAerolinea.Destino);
    $("#modalFechaLlegada").text(selectedAerolinea.FechaLlegada);
    $("#modalFechaSalida").text(selectedAerolinea.FechaSalida);
    $("#modalPaisSalida").text(selectedAerolinea.PaisSalida);
    $("#modalPrecio").text(selectedAerolinea.Precio);

    // Muestra el modal
    $("#myModal").modal("show");
  });
});
