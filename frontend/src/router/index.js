import { createRouter, createWebHistory } from 'vue-router'
const routes = [
	{
		path: '/login',
		name: 'login',
		component: () => import("../views/LoginRegView.vue"),
	},
	{
		path: '/',
		redirect: '/login'
	},
	{
		path: '/admin',
		name: 'admin',
		component: () => import('../views/administrator/AdministratorView.vue'),
	},
	{
		path: '/patient',
		name: 'patient',
		component: () => import('../views/patient/PatientView.vue'),
	},
	{
		path: '/doctor',
		name: 'doctor',
		component: () => import('../views/doctor/DoctorView.vue'),
		redirect: '/doctor/MRI/MRIDivision/',
		children:[
			{
				path: '/doctor/MRI/MRIDivision',
				name: 'MRIDivision',
				component: ()=>import("../views/doctor/MRI/MRIDivision.vue")
			},
			{
				path: '/doctor/DataManage/MRIManage',
				name: 'MRIManage',
				component: ()=>import("../views/doctor/DataManage/MRIManage.vue")
			},
			{
				path: '/doctor/DataManage/TumorManage',
				name: 'TumorManage',
				component: ()=>import("../views/doctor/DataManage/TumorManage.vue")
			},
			{
				path: '/doctor/Message/PatientMessage',
				name: 'PatientMessage',
				component: ()=>import("../views/doctor/Message/PatientMessage.vue")
			},
			{
				path: '/doctor/Message/ShareCase',
				name: 'ShareCase',
				component: ()=>import("../views/doctor/Message/ShareCase.vue")
			},
			{
				path: '/doctor/PatientList/PatientManage',
				name: 'PatientManage',
				component: ()=>import("../views/doctor/PatientList/PatientManage.vue")
			},
		]
	},

]
const router = createRouter({
	history: createWebHistory(),
	routes
})
export default router