<template>





	<div id="divContainer">
		<div class="post" v-for="(post, index) in posts" :key="index">


			<!-- TO location -->
			<p style="display: inline;" v-if="!post.editMode">To: </p>
			<!--			<i class='bx bxs-map-pin ' v-if="!post.editMode" style="display: inline;"></i> -->
			<country-flag :country="post.to_location" v-if="!post.editMode" size='normal' />

				<br v-if="!post.editMode">



				<!-- FROM location -->
				<p style="display: inline;" v-if="!post.editMode">From: </p>
				<!-- <i class='bx bx-map-pin ' v-if="!post.editMode" style="display: inline;"></i> -->
				<country-flag :country="post.from_location" v-if="!post.editMode" size='normal' />

					<br v-if="!post.editMode">



					<!-- PASSING location 
						<i class='bx bxs-map-alt' v-if="!post.editMode" style="display: inline;"></i>
						<country-flag v-for="(country, countryIndex) in post.passing_location" :key="countryIndex" :country="country"
						v-if="!post.editMode" size='normal' style="padding-left: 5px;" />
					-->

					<br v-if="!post.editMode">





					<!-- date of travelling-->
					<i style="display: inline; margin-right: 5px; " class='bx bxs-calendar ' v-if="!post.editMode"></i>
					<p style="display: inline; " v-if="!post.editMode">{{ post.date_of_traveling }} </p>

					<br v-if="!post.editMode">
					<br v-if="!post.editMode">


					<!-- description -->
					<i style="display: inline; margin-right: 5px;" class='bx bx-menu-alt-left' v-if="!post.editMode"></i>
					<p style="display: inline;" v-if="!post.editMode"> <span style="white-space: pre-wrap;">{{ post.description }} </span> </p>


					<template v-for="count in 3">
						<br v-if="!post.editMode">
					</template>

					<!-- email -->
					<a v-if="!post.editMode" :href="`mailto: ${post.email}`" class="button-3"><i class='bx bxs-envelope'></i></a>



					<template v-for="count in 3">
						<br v-if="!post.editMode">
					</template>



					<!-- map -->
					<iframe v-if="!post.editMode &&  post.map !== '' " class="iframe_map"  :src="post.map"></iframe>







					<div class="form-floating">
						<select id="to_location" v-if="post.editMode"  class="text_edit form-select" v-model="post.to_location">
							<option required disabled value="">Select a country</option>
							<option v-for="(country, index) in countries" :key="index" :value="country.code.toLocaleLowerCase()">{{ country.name }}</option>
						</select>

						<label for="to_location" class="form-label" v-if="post.editMode">To location</label>
					</div>  



					<br v-if="post.editMode">


					<div class="form-floating">
						<select id="from_location" v-if="post.editMode"  class="text_edit form-select" v-model="post.from_location">
							<option required disabled value="">Select a country</option>
							<option v-for="(country, index) in countries" :key="index" :value="country.code.toLocaleLowerCase()">{{ country.name }}</option>
						</select>

						<label for="from_location" class="form-label" v-if="post.editMode">From location</label>
					</div>


					<br v-if="post.editMode">




					<label class="form-label text-muted" v-if="post.editMode">Date of travelling</label>
					<br v-if="post.editMode">
					<input required v-if="post.editMode" type="date"  class="text_edit" v-model="post.date_of_traveling">

					<template v-for="count in 2">
						<br v-if="post.editMode">
					</template>




					<div class="form-floating">
						<textarea required id="desc" v-if="post.editMode" placeholder="Description" type="text" v-model="post.description" class="text_edit form-control" style="height: 100px; max-height: 650px;"></textarea>
						<label for="desc" class="form-label"  v-if="post.editMode">Description</label>
					</div>
					<br v-if="post.editMode">



					<div class="form-floating">

						<input required v-if="post.editMode" id="map_url" type="text" v-model="post.map" placeholder="Map URL" class="text_edit form-control">

						<label for="map_url" v-if="post.editMode">Map URL</label>
					</div>


					<template v-for="count in 2">
						<br v-if="post.editMode">
					</template>



					<button v-if="!post.editMode && post.email == email_if_logged" @click="toogleEditMode(index)" class="button-3 low"><i class='bx bxs-edit'></i></button>
					<button v-if="!post.editMode && post.email == email_if_logged" @click="deletePost(index)" class="button-3 low"><i class='bx bx-trash'></i></button>

					<button v-if="post.editMode" @click="cancelEdit(index)" class="button-3 low"><i class='bx bx-x'></i></button>
					<button v-if="post.editMode" @click="applyEdit(index)" class="button-3 low"><i class='bx bx-check'></i></button>





					</div>
		</div>
</template>


<script>



	import CountryFlag from 'vue-country-flag-next';

	// import sve countries..
	import { COUNTRIES } from '../../public/country.js';


	export default {

		components: {

			CountryFlag

		},



		props: ['posts','email_if_logged'],

		data() {

			return {

				postCopy: {}, // Store a copy of the original post object. ako kliknemo cancel ?

				selectedCountry: '',
				countries: COUNTRIES


			};



		},

		computed: {

			formattedDate() {


				const options = { year: 'numeric', month: 'long', day: 'numeric' };
				const dateParts = this.date_of_traveling.split('-');
				const year = parseInt(dateParts[0]);
				const month = parseInt(dateParts[1]) - 1; // Subtract 1 since month is zero-based
				const day = parseInt(dateParts[2]);
				const date = new Date(year, month, day);
				if (isNaN(date.getTime())) {
					return 'Invalid Date';
				}
				return date.toLocaleDateString(undefined, options);


			}
		
		},

		methods: {

			toogleEditMode(index) {
				this.posts[index].editMode = true;
				this.postCopy = { ...this.posts[index] }; // Make a copy of the original post object


			},
			cancelEdit(index) {
				this.posts[index] = { ...this.postCopy };  // ako je cancel, onda vrati svoj originalni values

				this.posts[index].editMode = false;
			},



			isGoogleMapsLink(url) {
				if (url === '') {
					return true; // Return true for empty URL
				}


				const pattern = /^(https:\/\/www\.google\.com\/maps\/d\/edit\?mid=([A-Za-z0-9_-]+)(&usp=sharing)?)|^(https:\/\/www\.google\.com\/maps\/d\/embed\?mid=([A-Za-z0-9_-]+))$/;


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



			applyEdit(index) {


				let isMapLink = this.isGoogleMapsLink(this.posts[index].map);


				if(isMapLink){



					this.posts[index].map = this.convertGoogleMapsLink(this.posts[index].map);


					this.posts[index].editMode = false;
					this.$emit('editpost',index)

				}else{
					alert("Maps URL is not valid");

				}




			},
			deletePost(index) {
				this.$emit('removepost',index);




			}


		}







	}
</script>


<style scoped>
.post {

	margin-bottom: 1em;
	/*margin-left: auto;
	margin-right: auto; */

	width: 90%;

	max-width: 90%;
	

	
	height: auto;

	padding: 20px;
	border: 3px solid white;
	border-radius: 8px;

	/* da ako je duzi, da word wrap  */
	word-wrap: break-word;

	box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
	transition: box-shadow 0.3s, transform 0.3s;


	background-color: white;


	

@media (min-width: 700px) {
	
	width: 60%;



}

	
}

.post:hover {

	box-shadow: 0px 6px 12px rgba(0, 0, 0, 0.15);
	transform: translateY(-4px);
}



#divContainer {

	/*display: grid;
	grid-template-columns: repeat(1, 1fr);
	grid-template-rows: repeat(auto-fit, minmax(0px, 1fr));
	gap: 2.5em;
	justify-items: center;
	/*padding: 10%; */
	
	display: flex;
  flex-direction: column;
  align-items: center;
	


}

.iframe_map {
	width: 100%;
	height: 250px;
	

@media (min-width: 700px) {
	
	height: 350px;



}

	
}


.date {
	font-size: 18px;
	font-weight: bold;
	color: #333;
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


.low {
	margin-right: 5px;
}




.text_edit{

	width: 90%;
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

</style>
