document.addEventListener('DOMContentLoaded', function() {
    const secciones = [
        {
            titulo: "ADA",
            enlaces: [
                { nombre: "evaluación", url: "../documentos/ADA-T0-Presentacion.pdf" },
            ]
        },
        {
            titulo: "AC",
            enlaces: [
                { nombre: "evaluación", url: "../documentos/AC-PresentacionTeoria2024.pdf" },
            ]
        },
        {
            titulo: "LPP",
            enlaces: [
                { nombre: "evaluación", url: "https://domingogallardo.github.io/apuntes-lpp/teoria/tema00-descripcion-asignatura/tema00-descripcion-asignatura.html#7-evaluacion" },
            ]
        }
    ];

    const seccionesContainer = document.getElementById('secciones-container');

    secciones.forEach(seccion => {
        const seccionDiv = document.createElement('div');
        seccionDiv.classList.add('seccion');

        const titulo = document.createElement('h2');
        titulo.textContent = seccion.titulo;
        seccionDiv.appendChild(titulo);

        const lista = document.createElement('ul');
        seccion.enlaces.forEach(enlace => {
            const item = document.createElement('li');
            const link = document.createElement('a');
            link.href = enlace.url;
            link.textContent = enlace.nombre;
            item.appendChild(link);
            lista.appendChild(item);
        });
        seccionDiv.appendChild(lista);
        seccionesContainer.appendChild(seccionDiv);
    });
});
