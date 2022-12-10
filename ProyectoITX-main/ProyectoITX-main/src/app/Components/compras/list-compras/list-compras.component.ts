import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PdfMakeWrapper, Table, Txt } from 'pdfmake-wrapper';
import { SharedServices } from 'src/app/Services/shared.service';
import { CompraDetail } from '../compradetail';
import { ComprasService } from '../compras.service';

@Component({
	selector: 'app-list-compras',
	templateUrl: './list-compras.component.html',
	styleUrls: ['./list-compras.component.css'],
})
export class ListComprasComponent implements OnInit {
	constructor (private compras_service: ComprasService,
		private sharedServices:SharedServices,
		private compraService: ComprasService
	) {}
	representatives!: any[];
	detallecompras!: CompraDetail[];
	arraySelected: any = [];
	selectedCompradetails!: any[];
	activityValues: number[] = [0, 100];
	statuses!: any[];
	loading: boolean = true;
	estados: any[] = [];

	cancelarCompra(cd: CompraDetail) {
		if (cd.id!= 0) {
			this.compras_service
				.changeStatusById(cd.id, "Cancelado")
				.subscribe( {complete:()=>
					this.compraService.getCompra().subscribe({
						next: (lista) => (this.detallecompras = lista),
						complete: () => {
							this.loading = false;
						},
					})
				});
		}
	}
	ngOnInit(): void {
		this.compraService.getCompra().subscribe({
			next: (lista) => (this.detallecompras = lista),
			complete: () => {
				this.loading = false;
				console.log(this.detallecompras);
			},
		});
		this.sharedServices.status$.subscribe(staus => this.estados = staus);
	}

	extractData(datosTabla: any) {
		return datosTabla.map((row: any) => [row.id, row.valor_total, row.estado]);
	}

	async generaraPDF() {
		if (this.arraySelected <= 0) {
			alert("Seleccione todas las compras para poder generara el pdf")
		} else {
			console.log(this.arraySelected)
			const pdf = new PdfMakeWrapper();
			pdf.pageOrientation('portrait')
			pdf.pageSize('A4')
			pdf.add(pdf.ln(2))
			pdf.add(new Txt("Reporte Compras").bold().italics().alignment('center').end);
			pdf.add(pdf.ln(2))
			pdf.add(new Table([
				['Id', 'Valor total', 'Estado'],
			]).widths(['*', '*', '*']).layout(
				{
					fillColor: (rowIndex?: number, node?: any, columnIndex?: number) => {
						return rowIndex === 0 ? '#CCCCCC' : '';
					}
				}
			).end)
			pdf.add(new Table([
				...this.extractData(this.arraySelected)
			]).widths('*').end)

			pdf.create().open();
		}
	}
}
