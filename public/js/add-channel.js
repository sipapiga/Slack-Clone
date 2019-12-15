$(() => {
    $("#private").on("click", () => {
        $("#user").prop("disabled", false);
    })

    $("#public").on("click", () => {
        $("#user").prop("disabled", true);
    })
});