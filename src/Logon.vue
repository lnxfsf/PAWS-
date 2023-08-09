<template>







	<!-- LOGIN  -->
	<form @submit.prevent="login" autocomplete="off" class="sign-in-form">
		<div class="logo">
			<h4>PAWS</h4>
		</div>

		<div class="heading">
			<h2>Welcome Back</h2>
			<h6>Not registred yet?</h6>
			<a href="#" class="toggle">Sign up</a>
		</div>

		<div class="actual-form">
			<div class="input-wrap">
				<input
						v-model="email"
						type="text"
						minlength="4"
						class="input-field"
						autocomplete="off"
						required
						/>
				<label>Email</label>
			</div>

			<div class="input-wrap">
				<input
						v-model="password"
						type="password"
						minlength="4"
						class="input-field"
						autocomplete="off"
						required
						/>
				<label>Password</label>
			</div>

			<input type="submit" value="Sign In" class="sign-btn" />

			<p class="text">
			Forgotten your password or you login datails?
			<a href="#">Reset password</a> 
			</p>
		</div>
	</form>





	<!-- SIGN UP -->
	<form  @submit.prevent="signup"  autocomplete="off" class="sign-up-form">
		<div class="logo">
			<h4>PAWS</h4>
		</div>

		<div class="heading">
			<h2>Get Started</h2>
			<h6>Already have an account?</h6>
			<a href="#" class="toggle">Sign in</a>
		</div>

		<div class="actual-form">
			<div class="input-wrap">
				<input
						v-model="name"
						type="text"
						minlength="4"
						class="input-field"
						autocomplete="off"
						required
						/>
				<label>Name</label>
			</div>

			<div class="input-wrap">
				<input
						v-model="email"
						type="email"
						class="input-field"
						autocomplete="off"
						required

						/>
				<label>Email</label>
			</div>

			<div class="input-wrap">
				<input
						v-model="password"
						type="password"
						minlength="4"
						class="input-field"
						autocomplete="off"
						required
						/>
				<label>Password</label>
			</div>

			<input type="submit" value="Sign Up" class="sign-btn" />


			<p class="text">
			By signing up, I agree to the
			<a href="TOS.html#TOS">Terms of Services</a> and
			<a href="TOS.html#privacy">Privacy Policy</a>
			</p>
		</div>
	</form>





	<p >{{ name }}</p>
	<p >{{ email }}</p>
	<p >{{  password }}</p>



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
