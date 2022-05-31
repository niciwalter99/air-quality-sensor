if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("sw.js").then(registration => {
        console.log("Registered");
        console.log(registration);
    }).catch(error => {
        console.log("Registration failedA");
        console.log(error);
    })
} else {
    console.log("No Service Worker");
}
