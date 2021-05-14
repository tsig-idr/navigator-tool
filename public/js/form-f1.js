var uid = '';

document.querySelectorAll('[type="file"]').forEach(function (input) {
	input.addEventListener('change', function (ev) {
		var file = ev.target.files[0],
			reader;
		if (!file) {
			return false;
		}
		reader = new FileReader();
		reader.onload = function (ev) {
			fetch(`/files/F1/${input.name}.csv?uid=${uid}`, {
				method: 'POST',
				body: JSON.stringify({
					data: ev.target.result
				}),
				headers: {
					'Content-type': 'application/json; charset=UTF-8'
				}
			}).then(function (response) {
				if (response.ok) {
					return response.json();
				}
				return Promise.reject(response);
			}).then(function (data) {
				uid = data.uid;
			}).catch(function (error) {
				console.warn('Something went wrong.', error);
			});
		};
		reader.readAsText(file);
	});
});
