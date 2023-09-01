<template>







	<!-- LOGIN  -->
	<form @submit.prevent="login" autocomplete="off" class="sign-in-form">
		
		<div class="heading">
			<h2>Sign In</h2>
		</div>

			<div class="input-wrap">
				<input
						v-model="email"
						type="text"
						minlength="4"
						class="input-field"
						autocomplete="off"
						required
						placeholder="Email"
						/>
			</div>

			<div class="input-wrap">
				<input
						v-model="password"
						type="password"
						minlength="4"
						class="input-field"
						autocomplete="off"
						required
						placeholder="Password"
						/>
			</div>

			<input type="submit" value="Sign In" class="sign-btn button-3" />

			<!-- 
			<p class="text">
			Forgotten your password or you login datails?
			<a href="#">Reset password</a> 
			</p>
-->
	</form>





	<!-- SIGN UP -->
	<form  @submit.prevent="signup"  autocomplete="off" class="sign-up-form">
		
		<div class="heading">
			<h2>Sign up</h2>
		</div>

					<div class="input-wrap">
				<input
						v-model="name"
						type="text"
						minlength="4"
						class="input-field"
						autocomplete="off"
						required
						placeholder="Name"
						/>
			</div>

			<div class="input-wrap">
				<input
						v-model="email"
						type="email"
						class="input-field"
						autocomplete="off"
						required
						placeholder="Email"

						/>
			</div>

			<div class="input-wrap">
				<input
						v-model="password"
						type="password"
						minlength="4"
						class="input-field"
						autocomplete="off"
						required
						placeholder="Password"
						/>
			</div>

			<input type="submit" value="Sign Up" class="sign-btn button-3" />


			<!--
			<p class="text">
			By signing up, I agree to the
			<a href="TOS.html#TOS">Terms of Services</a> and
			<a href="TOS.html#privacy">Privacy Policy</a>
			</p>

		-->
	</form>







</template>

<script>

	import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth'
	import { auth, db } from './firebase/init.js'

	// the relevant methods
	import { collection, addDoc, doc, setDoc, getDoc } from "firebase/firestore"

	export default {


		data() {
			return {

				name: '',
				email: '',
				password: '',







			}



		},

		methods: {

			signup(){

				// register new user
				createUserWithEmailAndPassword(auth,this.email,this.password)
					.then((credential) => {
						// registered and signed in
						console.log(credential.user)

						setDoc(doc(db, 'users', credential.user.uid), {
							name: this.name,
							email: this.email



						})



					})
					.catch((error) => {
						console.log(error.message)
					})		


			},

			login(){
				console.log("doing")
				signInWithEmailAndPassword(auth,this.email,this.password)
					.then((credential) => {
						// emit event for member area

						//const docSnap = getDoc(doc(db, 'users', credential.user.uid))
						//let h = docSnap.data().name


						//const docRef = doc(db, "users",credential.user.uid );
						//const docSnap = getDoc(docRef);
						//
						//  console.log("Document data:", docSnap.data());
						//if (docSnap.exists()) {
						//  console.log("Document data:", docSnap.data());
						//} else {
						//  // docSnap.data() will be undefined in this case
						//  console.log("No such document!");
						//}
						getDoc(doc(db, "users", credential.user.uid)).then(docSnap => {
							if (docSnap.exists()) {

								this.$emit('loggedIn',docSnap.data().name)

								console.log("Document data:", docSnap.data());
							} else {
								console.log("No such document!");
							}
						})







						console.log("done")
						console.log(credential.user)





					})

			}







		}

	}





</script>



<style scoped>
.sign-up-form, .sign-in-form {
	display: flex;

align-items: center;
    justify-content: center;
flex-direction: column;
margin: 5em;
row-gap: 0.5em;
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



</style>
