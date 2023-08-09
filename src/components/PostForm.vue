


<template>



	<div class="filter_div" >


		<!-- FAB -->
		<!-- Button to open the popup -->
		<div @click="openPopup" class="fab-container" v-if="this.email_logged">

			<div class="button iconbutton">
				<i style="font-size: 2.5em; color: #121212;" class='bx bxs-message-square-add bx-tada-hover'></i> 

			</div>

		</div>	





		<button @click="changeFilter" style="border: 0; background-color: #f1f1f1; border-radius: 30px;">Filter <i class='bx bx-filter'></i></button>


		<transition name="fade" appear>

		<div v-if="filterz"  class="filter_div" >
			<p>Filter by country</p>
			<div class="form-floating" >
				<select id="to_location" v-model="selectedCountryFilter_to"  class="text_edit form-select" @change="filterPosts">
					<option required disabled value="">Select a country</option>
					<option v-for="(country, index) in countries" :key="index" :value="country.code.toLocaleLowerCase()">{{ country.name }}</option>
				</select>

				<label for="to_location" class="form-label" >To location</label>
			</div>  


			<br>


			<div class="form-floating">
				<select id="from_location" v-model="selectedCountryFilter_from"  class="text_edit form-select" @change="filterPosts">
					<option required disabled value="">Select a country</option>
					<option v-for="(country, index) in countries" :key="index" :value="country.code.toLocaleLowerCase()">{{ country.name }}</option>
				</select>

				<label for="from_location" class="form-label" >From location</label>
			</div>



		</div>

		</transition>




		<!-- The dialog popup -->
		<dialog ref="postDialog">
			<!-- Form content inside the dialog -->
			<div>




				<div class="form-floating" >
					<select required class="text_edit form-select" v-model="to_location">
						<option  disabled value="">Select a country</option>
						<option  v-for="(country, index) in countries" :key="index" :value="country.code.toLocaleLowerCase()">{{ country.name }}</option>
					</select>

					<label class="form-label">To location</label>


				</div>


				<br>



				<div class="form-floating">
					<select required class="text_edit form-select" v-model="from_location" >
						<option disabled value="">Select a country</option>
						<option v-for="(country, index) in countries" :key="index" :value="country.code.toLocaleLowerCase()">{{ country.name }}</option>
					</select>

					<label class="form-label">From location</label>


				</div>






				<br>


				<label class="form-label text-muted" >Date of travelling</label>
				<br>
				<input required v-model="date_of_traveling"  class="text_edit" type="date" />




				<br>
				<br>



				<div class="form-floating">

					<textarea required placeholder="Description" type="text" v-model="description" class="text_edit form-control" style="height: 100px; max-height: 650px;"></textarea>
					<label  class="form-label"  >Description</label>

				</div>





				<br>

				<div class="form-floating">

					<input type="text" required v-model="map" placeholder="Map URL" class="text_edit form-control">

					<label  >Map URL</label>
				</div>



				<br>

				<button @click="submitForm" class="button-3">Submit</button>





			</div>
		</dialog>
	</div>

</template>


<script>




	// import sve countries..
	import { COUNTRIES } from '../../public/country.js';


	export default {

		props: ['posts', 'email_logged'],

		data() {
			return {
				to_location: '',
				from_location: '',
				date_of_traveling: '',

				description: '',
				email: '',
				map: '',


				// ovaj variable bi sluzio: da se post obrise nakon nekog vremena , to gledas po onom date_of_publishing. 
				publish_date: '',
				editMode: false,



				selectedCountry: '',
				countries: COUNTRIES,
				filterz: false,
				selectedCountryFilter_to: '',
				selectedCountryFilter_from: '',
				filter: {}





			};
		},

		methods: {

			changeFilter() {

				//console.log(this.filterz);
				this.filterz = !this.filterz;

				// onda da posalje prazan ''  kako bi prikazao sve posts kada zatvori button... 
				if(this.filterz == false){

					this.selectedCountryFilter_to = '';
					this.selectedCountryFilter_from = '';
					this.filterPosts();





				}


			},

			getCurrentDate() {
				const currentDate = new Date();
				const year = currentDate.getFullYear();
				const month = String(currentDate.getMonth() + 1).padStart(2, '0');
				const day = String(currentDate.getDate()).padStart(2, '0');
				return `${year}-${month}-${day}`;
			},  


			openPopup() {
				// Use the dialog.show() method to show the popup
				this.$refs.postDialog.showModal();
			},

			closePopup() {
				// Use the dialog.close() method to close the popup
				this.$refs.postDialog.close();
			},


			filterPosts(){



				this.filter = {
					to: this.selectedCountryFilter_to,
					from: this.selectedCountryFilter_from

				};

				this.$emit('filteredPosts',this.filter);








			},


			isGoogleMapsLink(url) {
				if (url === '') {
					return true; // Return true for empty URL
				}


				const pattern = /^https:\/\/www\.google\.com\/maps\/d\/edit\?mid=([A-Za-z0-9_-]+)(&usp=sharing)?$/;
				return pattern.test(url);
			},


			convertGoogleMapsLink(url) {
				if (url === '') {
					return ''; // Return empty string for empty URL
				}

				const pattern = /^https:\/\/www\.google\.com\/maps\/d\/edit\?mid=([A-Za-z0-9_-]+)(&usp=sharing)?$/;

				const match = url.match(pattern);

				if (match) {
					const mid = match[1];
					const alteredUrl = `https://www.google.com/maps/d/embed?mid=${mid}`;
					return alteredUrl;
				} else {
					return url; // Return original URL if it doesn't match the pattern
				}
			},

			submitForm() {


				// map sharing link da bude koji moze prikazati u embeded !
				// proveri da li je link  od google maps validan prvo, ako ne, da ne pusta.. 
				let isMapLink = this.isGoogleMapsLink(this.map);


				if(
					this.to_location &&
					this.from_location &&
					this.date_of_traveling &&
					this.description &&
					isMapLink

				){
					this.publish_date = this.getCurrentDate();

					this.map = this.convertGoogleMapsLink(this.map);


					this.email = this.email_logged;




					const newPost = {
						to_location: this.to_location,
						from_location: this.from_location,
						date_of_traveling: this.date_of_traveling,
						description: this.description, 
						email: this.email,
						map: this.map,
						publish_date: this.publish_date,
						editMode: this.editMode


					};


					this.$emit('postAdded', newPost);


					this.to_location = '';
					this.from_location = '';
					this.date_of_traveling = '';

					this.description = '',
						this.email = ''
					this.map = '',

						this.publish_date = '';



					this.closePopup();


				}else{

					if(!isMapLink){

						console.log("This is not a valid Google Maps link");
						alert("Maps sharing link is invalid. Leave maps field empty if you don't have map route")
						this.map = '';
					}else{

						alert("Fill all fields");
					}

				}






			},
		},
	};
</script>



<style scoped>

.preserve-whitespace {
	white-space: pre-line;
}

/* Reset default browser styles */
input[type="date"] {
	appearance: none;
	-webkit-appearance: none;
	-moz-appearance: none;
	padding: 0.375rem 0.75rem;
	font-size: 1rem;
	line-height: 1.5;
	color: #212529;
	background-color: #fff;
	border: 1px solid #ced4da;
	border-radius: 0.375rem;
	transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
}

  /* Custom styles for Material Design 3 */
  input[type="date"]::-webkit-datetime-edit {
	  padding: 0;
  }

  input[type="date"]::-webkit-datetime-edit-fields-wrapper {
	  display: flex;
  }

  input[type="date"]::-webkit-datetime-edit-text {
	  flex: 1;
	  padding: 0.375rem 0.25rem;
  }

  input[type="date"]::-webkit-datetime-edit-month-field,
  input[type="date"]::-webkit-datetime-edit-day-field,
  input[type="date"]::-webkit-datetime-edit-year-field {
	  flex: 1;
	  padding: 0.375rem 0.25rem;
	  border: none;
  }

  input[type="date"]::-webkit-inner-spin-button {
	  display: none;
  }

  input[type="date"]::-webkit-calendar-picker-indicator {
	  padding: 0.375rem 0.75rem;

	  background-color: transparent;
	  border: none;

	  cursor: pointer;

  }

  input[type="date"]:focus {
	  border-color: #4e9af1;
	  outline: 0;
	  box-shadow: 0 0 0 0.25rem rgba(78, 154, 241, 0.25);
  }








  .button-3 {
	  appearance: none;
	  background-color: #469387;
	  border: 1px solid rgba(27, 31, 35, .15);
	  border-radius: 6px;
	  box-shadow: rgba(27, 31, 35, .1) 0 1px 0;
	  box-sizing: border-box;
	  color: #fff;
	  cursor: pointer;
	  display: inline-block;
	  font-family: -apple-system, system-ui, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji";
	  font-size: 14px;
	  font-weight: 600;
	  line-height: 20px;
	  padding: 6px 16px;
	  position: relative;
	  text-align: center;
	  text-decoration: none;
	  user-select: none;
	  -webkit-user-select: none;
	  touch-action: manipulation;
	  vertical-align: middle;
	  white-space: nowrap;
  }

  .button-3:focus:not(:focus-visible):not(.focus-visible) {
	  box-shadow: none;
	  outline: none;
  }

  .button-3:hover {
	  background-color: #2c974b;
  }

  .button-3:focus {
	  box-shadow: rgba(46, 164, 79, .4) 0 0 0 3px;
	  outline: none;
  }

  .button-3:disabled {
	  background-color: #94d3a2;
	  border-color: rgba(27, 31, 35, .1);
	  color: rgba(255, 255, 255, .8);
	  cursor: default;
  }

  .button-3:active {
	  background-color: #298e46;
	  box-shadow: rgba(20, 70, 32, .2) 0 1px 0 inset;
  }

  .text_edit{

	  width: 90%;
  }


</style>
