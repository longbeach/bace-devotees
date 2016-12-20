import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbModalRef, NgbModalOptions, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { Devotee } from '../devotee';
import { FormComponent } from './form/form.component';
import { ApiService } from '../api.service';

@Component({
	selector: 'app-admin',
	templateUrl: './admin.component.html',
	styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

	devoteesList: Devotee[];

	constructor(private apiService: ApiService,
		private router: Router,
		private modalService: NgbModal) { }


	ngOnInit() {
		this.devoteesList = [];
		let devotee: Devotee = new Devotee();
		devotee.name = 'Ashish Doneriya';
		this.devoteesList.push(devotee);
	}

	addDevotee() {
		let devotee: Devotee = new Devotee();
		let modelOption: NgbModalOptions = { backdrop: false, keyboard: true };
		let modalRef: NgbModalRef = this.modalService.open(FormComponent, modelOption);
		modalRef.componentInstance.devotee = devotee;
		modalRef.result.then(result => {
			if (result == 'save') {
				this.apiService.add(devotee);
			}
		});
	}

	logout() {
		this.apiService.logout();
		this.router.navigate(['login']);
	}

	updateList() {
		this.apiService.list().subscribe()
	}
}