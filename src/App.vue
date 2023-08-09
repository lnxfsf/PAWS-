

<template>

	<!-- ==================== NAVBAR ====================  -->
	<div id="navbar">


		<div id="navbar_image" width="50em" height="50em">
			<img src="./images/favicon.png" style="padding: 10px; width:5em !important; height: 5em !important; ">
		</div>

		<div id="navbar_first_buttons">

			<router-link to="/" >Home</router-link>
			<router-link to="/help" >Help</router-link>

		</div>

		<div id="navbar_second_buttons" >
			<router-link to="/logon"  v-show="!isLoggedIn" >Register</router-link>
			<router-link to="/logon"  v-show="!isLoggedIn" id="navbar_second_buttons_login">Login</router-link>
			<button to="/logon"  v-show="isLoggedIn" @click="logout" id="navbar_second_buttons_login">{{ logged_in_name }} - LOGOUT ?</button>
		</div>




	</div>
	<!-- ==================== NAVBAR ====================  -->




	<router-view :email_logged_main="logged_in_email" ></router-view>

	

	<!-- ==================== FOOTER ====================   -->

	<footer class="footer-basic">
		<div class="social">
			<a id="insta" href="#"><i class='bx bxl-instagram bx-tada-hover' style='color:#ffffff' ></i></a>
			<a id="snap" href="#"><i class='bx bxl-snapchat bx-tada-hover' style='color:#ffffff' ></i></a>
			<a id="twitter" href="#"><i class='bx bxl-twitter bx-tada-hover' style='color:#ffffff' ></i></a>
			<a id="facebook" href="#"><i class='bx bxl-facebook bx-tada-hover' style='color:#ffffff' ></i></a>
		</div>
		<ul class="list-inline">
			<li class="list-inline-item"><a href="#">Home</a></li>
			<li class="list-inline-item"><a href="#">Services</a></li>
			<li class="list-inline-item"><a href="#">About</a></li>
			<li class="list-inline-item"><a href="#">Terms</a></li>
			<!-- <li class="list-inline-item"><a href="#">Privacy Policy</a></li>-->
		</ul>
		<div class="copyright">
			PAWS &copy;
			<p style="display: inline;">{{  currentYear }}</p>
		</div>
	</footer>


	<!-- ==================== FOOTER ====================   -->




</template>

<script>




	import Post from './components/Post.vue';
	import PostForm from './components/PostForm.vue';

	import { auth, db } from './firebase/init.js'
	import { signOut } from 'firebase/auth'
	import { collection, addDoc, doc, setDoc, getDoc, getDocs, query } from "firebase/firestore"
	

	
	export default {
		components: {
			Post,
			PostForm
		},


		computed: {

			currentYear() {
				return new Date().getFullYear();
			},


		},


		data() {
			return {
				isLoggedIn: false, 
				logged_in_name: '',
				logged_in_email: '',



			};


		},

		created() {
			auth.onAuthStateChanged(user => {

				console.log(this.user)
				if(user){

					this.isLoggedIn = true,


						getDoc(doc(db, "users", user.uid)).then(docSnap => {
							if (docSnap.exists()) {

								this.logged_in_name = docSnap.data().name;
								this.logged_in_email = docSnap.data().email;

								console.log("Document data:", docSnap.data());
							} else {
								console.log("No such document!");
							}
						})





				}


			});

		},

		methods: {
			addNewPost(newPost) {
				this.posts.push(newPost);
			},

			logged_in(name){
				this.isLoggedIn = true
				this.logged_in_name=name;

			},


			logout() {

				signOut(auth)
					.then(() => {
						// user signed-out
						this.isLoggedIn = false;
						this.logged_in_name = '';
						this.logged_in_email = '';
					})


			}





		}




	}


</script>


