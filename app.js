
    var app = new Vue({
		el: '#app',
		data: {

			personas: [],
			nuevoBool: false,

		},
		mounted: function () {
		    this.select();
		},
		methods: {
		    nuevo: function (event) {

		    	if(!app.nuevoBool){
		    		app.nuevoBool = true;
		    	}else{
		    		app.nuevoBool = false;
		    	}

		    },

		    editar: function (event) {

		    	if($("button[name="+event.target.name+"]").html()=="Editar"){

			    	let nombre = $("[title="+event.target.name+"]:first").html().trim();

			    	let edad = $("[title="+event.target.name+"]:nth-child(2)").html().trim();

			    	$("[title="+event.target.name+"]:first").empty();

			    	$("[title="+event.target.name+"]:nth-child(2)").empty();

			    	$("[title="+event.target.name+"][name='nombre']").append(`
			    	<input title='`+event.target.name+`' name='nombreEditar' type='text' required value='`+nombre+`'>`);

			    	$("[title="+event.target.name+"][name='edad']").append(`
			    	<input title='`+event.target.name+`' name='edadEditar' type='text' required value='`+edad+`'>`);

			    	$("button[name="+event.target.name+"][title='editar']").attr("class","primary button").html('Guardar cambios');

				}else{


					let nombre = $("input[title="+event.target.name+"][name='nombreEditar']").val();

					let edad = $("input[title="+event.target.name+"][name='edadEditar']").val();

					fetch('https://crud-django-back.herokuapp.com/polls/update/',{
						method: 'POST',
						headers: new Headers({}),
						body: JSON.stringify({id: event.target.name, nombre: nombre.trim(), edad: edad.trim()}),
					})
					.then(response3 => response3.text())
					.then((data3) => {

							console.log(data3);

							$.when(this.select()).then(this.afterEdit(event.target.name));

					});

				}
		    },
		    afterEdit: function (id) {

				$("input[title="+id+"]").each(function(index) {

					$(this).replaceWith($(this).val().trim());

				});

				$("button[name="+id+"][title='editar']").attr("class","warning button").html('Editar');

		    },
		    agregar: function (event) {

		    	let nombreNuevo = $("#nameNewInput").val();

		    	let edadNuevo = $("#edadNewInput").val();

				fetch('https://crud-django-back.herokuapp.com/polls/add/',{
					method: 'POST',
			        headers: new Headers({}),
			        body: JSON.stringify({nombre: nombreNuevo.trim(), edad: edadNuevo.trim()}),
				})
				.then(response => response.text())
				.then((data) => {
					console.log(data);
					this.select();
					app.nuevoBool = false;
				});


		    },
		    eliminar: function (event) {

				fetch('https://crud-django-back.herokuapp.com/polls/delete/',{
					method: 'POST',
					headers: new Headers({}),
					body: JSON.stringify({id: event.target.name}),
				})
				.then(response2 => response2.text())
				.then((data2) => {
					console.log(data2);
					this.select();
				});

		    },
		    select: function (event) {

				fetch('https://crud-django-back.herokuapp.com/polls/select/',{
					method: 'POST',
					headers: new Headers({}),
					body: JSON.stringify({accion: "select"}),
				})
				.then(response4 => response4.json())
				.then((data4) => {

						app.personas = [];

						console.log(data4['Resultados']);

						for (var i = 0; i < data4['Resultados'].length; i++) {

							app.personas.push(data4['Resultados'][i]['fields']);

							app.personas[i].id = data4['Resultados'][i]['pk']; 

						}

						app.personas.reverse();

						console.log(app.personas);


				});

		    },
		  }
	})