


<template>


	<!--  -->
	<PostForm  @filteredPosts="filter_get" :email_logged="email_logged_main" :posts="posts" @postAdded="addNewPost">


	</PostForm>



	<post @editpost="editPost" @removepost="removePost" :posts="posts" :email_if_logged="email_logged_main">

	</post>


</template>

<script>






	import Post from './components/Post.vue';
	import PostForm from './components/PostForm.vue';


	import { auth, db } from './firebase/init.js'
	import { signOut } from 'firebase/auth'
	import { collection,query,where, updateDoc, addDoc, doc,setDoc, getDoc, getDocs, onSnapshot, deleteDoc} from "firebase/firestore"

	export default {
		props: ['email_logged_main'],	


		components: {
			Post,
			PostForm
		},

		data() {
			return {

				posts: [ ],
				filter: {to: '', from: ''},

				ind: true,
				//query.. 
				q: ''


			};


		},



		watch: {

			ind(){


				this.updatePosts();

			},
			'filter.to': function(newToValue) {
				this.q = '';
			},
			'filter.from': function(newFromValue) {
				this.q = '';
			}

		},

		created(){
			this.updatePosts();

		},




		methods: {

			updatePosts(){





				if(this.ind == true){


					const countriesCollection = collection(db, 'posts'); 




					this.unsubscribeFirestore = onSnapshot(countriesCollection, (snapshot) => {
						snapshot.docChanges().forEach((change) => {
							if (change.type === 'added') {




								const data = change.doc.data();
								data.id = change.doc.id;

								const existingInd = this.posts.findIndex((post) => post.id === data.id);
								if(existingInd === -1){

									this.posts.push(data); 
								}



							} else if (change.type === 'modified') {
								const data = change.doc.data();
								data.id = change.doc.id;
								const existingIndex = this.posts.findIndex((post) => post.id === data.id);
								if (existingIndex !== -1) {
									this.posts[existingIndex] = data; // Update modified document's data in the posts array
								}
							} else if (change.type === 'removed') {
								const removedId = change.doc.id;
								this.posts = this.posts.filter((post) => post.id !== removedId); // Remove deleted document from the posts array
							}
						});

						console.log('Updated Posts array:', this.posts);
					});













				}


				if(this.ind == false){



					const countriesCollection = collection(db, 'posts'); // Reference to the 'countries' collection


					// ako su oba stringa prikazana da filtira po njima obema striktno. radice.. da.. samo njih...
						if(this.filter.to !== '' && this.filter.from !== ''){

							this.q = query(countriesCollection, where('to_location', '==', this.filter.to),where('from_location', '==', this.filter.from));


						}else if(this.filter.to == ''){
							// kada je TO prazan a FROM je pun, njegov query
							this.q = query(countriesCollection,where('from_location', '==', this.filter.from));

						}else if(this.filter.from == ''){
							// kada je FROM prazan a TO je pun, njegov query
							this.q = query(countriesCollection,where('to_location', '==', this.filter.to));

						}



					onSnapshot(this.q, (snapshot) => {
						this.posts = []; // Clear the array before updating with new data

						snapshot.forEach((doc) => {
							const data = doc.data();
							data.id = doc.id;
							this.posts.push(data); // Add each document's data to the posts array
						});

						console.log('Posts array:', this.posts); // Log the populated posts array
					});





				}



			},



			filter_get(filter_getz){
				this.filter.to = filter_getz.to;
				this.filter.from = filter_getz.from;


				console.log("getting:" + this.filter.to)
				console.log("getting:" + this.filter.from)





					if(!(this.filter.to !== '' || this.filter.from !== '')){

						//prikaze sve
						this.ind = true;


						this.q = '';


					}else{
						// prikaze samo filtered					
						this.ind = false;
					}



			},



			async addNewPost(newPost) {
				//this.posts.push(newPost);

					//	const data = doc.data();
				//		data.id = doc.id;

				if(this.email_logged_main !== ''){
					await addDoc(collection(db, 'posts'), newPost)
				}else{
					alert("Sign in first");
				}





			},

			async removePost(index){

					if(this.posts[index].email == this.email_logged_main &&  this.email_logged_main !== ''){
						await deleteDoc(doc(db,'posts',this.posts[index].id));
						console.log("you are autorised");

					}else{
						console.log("you are not signed in as email user needed");
						alert("You have no privileges, sign in your account");
					}



			},


			async editPost(index){



				if(this.posts[index].email == this.email_logged_main &&  this.email_logged_main !== ''){
					await updateDoc(doc(db, 'posts', this.posts[index].id), this.posts[index] );
					console.log(this.posts[index]);
				} else{
					console.log("you are not signed in as email user needed");
					alert("You have no privileges, sign in your account");
				}


			}


		}


	}


</script>


