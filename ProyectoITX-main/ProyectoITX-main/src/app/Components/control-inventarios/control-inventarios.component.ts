import { Component, OnInit } from '@angular/core';
import { Compra } from '../compras/compra';
import { CompraDetail } from '../compras/compradetail';
import { ComprasService } from '../compras/compras.service';
import { Producto } from '../products/producto';
import { ProductosService } from '../products/productos.service';
import { BodegasService } from '../bodegas/bodegas.service';
import { Bodega } from '../bodegas/bodega';
import { PdfMakeWrapper, Table, Txt } from 'pdfmake-wrapper';
import { SharedServices } from 'src/app/Services/shared.service';
import { UsuarioService } from 'src/app/Services/usuario.service';
import { PersonalCargoService } from 'src/app/Services/personal-cargo.service';
import { Empresa } from 'src/app/Models/Empresa';
import { PersonalCargo } from 'src/app/Models/personal-cargo';
import { ControlInventariosService } from './control-inventarios.service';
import { ControlInventarios } from './control-inventarios';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertsService } from '@service/alerts';
@Component({
	selector: 'app-control-inventarios',
	templateUrl: './control-inventarios.component.html',
	styleUrls: ['./control-inventarios.component.css'],
	providers: [ComprasService],
})
export class ControlInventariosComponent implements OnInit {
	controlForm!: FormGroup;

	constructor (private personalCargoService: PersonalCargoService,
		private compras_service: ComprasService,
		private sharedServices: SharedServices,
		private bodegasService: BodegasService,
		private productServices: ProductosService, private alert: AlertsService,
		private usuarioService: UsuarioService,
		private controlServices: ControlInventariosService) {}

	empresa = new Empresa();
	current_listaCompra={} as CompraDetail;

	clonedProducts: { [s: string]: Compra; } = {};

	estadoSeleccionado: string = "Pendiente";
	current_state!: string;

	new_product = {} as Producto;
	control = {} as ControlInventarios;
	bodega = {} as Bodega;

	selectedBodega= {} as Bodega;

	listaCompras: CompraDetail[] = [];
	compraDetail: CompraDetail[] = [];

	personal: PersonalCargo[] = [];
	compraItems: Compra[] = [];
	products2: Compra[] = [];
	bodegas_a: Bodega[] = [];
	bodegas: Bodega[] = [];
	estados: any[] = [];

	productDialog!: boolean;
	exist_bodegas: Boolean = false;
	submitted!: boolean;
	loading!: boolean;

	arraySelected: any;
	id_to_edit = 0;

	//! Aun falta validaaar

	ngOnInit(): void {

		this.initListCompras();

		this.sharedServices.status$.subscribe(staus => this.estados = staus);
		this.obtenerEmpresa();
	}

	obtenerEmpresa() {
		let idUsuario = localStorage.getItem('idUsuario');
		this.usuarioService.getPorId(idUsuario).subscribe({
			next: (data) => {
				console.log(data);
				this.empresa = data.empresa!;
			},
			complete: () => this.getPersonal(),
		});
	}
	selectBodega(event: any) {
		this.bodega = this.bodegas[event.target.value];
		this.bodegas_a.push(this.bodega);
	}
	getPersonal() {
		this.personalCargoService
			.getByEmpresaCargo(this.empresa.idEmpresa, 'Bodega')
			.subscribe({
				next: (bodegero) => {
					this.personal = bodegero;
					console.log(this.personal);
				},
			});
	}

	editCompraDetail(cd: CompraDetail) {
		console.log(cd.compras);
		this.compraDetail.push(cd);
		this.current_listaCompra = cd;
		this.compraItems = cd.compras;
		this.productDialog = true;
		console.log(cd.id);
		this.id_to_edit = cd.id;
		this.estadoSeleccionado = cd.estado;
		this.current_state = cd.estado;
	}

	initBodegas() {
		this.bodegasService.getByEmpresa(this.empresa.idEmpresa).subscribe({
			next: (bodegas) => {
				bodegas.forEach(element => {
					if (element.estado) {
						this.bodegas.push(element);
					}
					if (this.bodegas.length > 0) {
						this.exist_bodegas = true;
					}
				});
			}, error: () => console.warn("No se pudo obtener la bodegas ")
		})
	}

	hideDialog() {
		this.productDialog = false;
		this.submitted = false;
	}

	addProductsTodb() {
		// console.log('Pedido', this.listaCompras);
		this.listaCompras.forEach((pedido) => {
			// console.log('Lista compras', pedido.compras);
			pedido.compras.forEach((item) => {
				// console.log('Cantidad', item.cantidad, 'Cantidad Unitarias', item.cantidad_unitarias);
				let id: any;
				id = item.producto.id?.toString();
				// console.log('Id producto', id, 'Cantidad producto', item.producto.cantidad);
				// console.log('Producto', item.producto);
				this.new_product = item.producto;
				this.new_product.cantidad = item.cantidad_unitarias;
				// console.log('New Producto', this.new_product);
				this.productServices
					.update_cantidad_Product(id, item.cantidad_unitarias)
					.subscribe({
						complete: () => {
							console.warn('Actualizacion hecha ');
						},
						error: () => {
							console.error('No se pudo aceptar la compra ');
						},
					});
			});

		});
		this.alert.showInfo("Stock de productos actualizado", "Control de inventarios")
		// this.updateControl();
	}
	updateControl() {
		if (this.selectedBodega == null || this.control.fecha_caducidad == null || this.control.fecha_elaboracion == null) {
			this.alert.showWarnig("Debe llenar todos los campos", "Control de inventarios")
		} else {
			this.control.detalleCompras = this.current_listaCompra ;
			this.control.bodega = this.selectedBodega;
			this.control.empresa = this.empresa;
			this.control.fecha_caducidad = new Date(this.control.fecha_caducidad);
			this.control.fecha_elaboracion = new Date(this.control.fecha_elaboracion);
			// this.control.fecha_caducidad = new Date(
			// 	new Date().getTime() + 24 * 60 * 60 * 1000
			// );

			// this.control.fecha_elaboracion = new Date(
			// 	new Date().getTime() + 24 * 60 * 60 * 1000
			// );

			this.control.stock_max = this.selectedBodega.capacidad_max;
			this.control.stock_min = 0;

			this.controlServices.addInventario(this.control).subscribe({
				next: (control) => {
					console.log(control)
				}
				, complete: () => {

					this.alert.showSuccess("Estado de inventario actualizado", "Control de inventarios");
					this.updateStatus();
					this.addProductsTodb();
				}
				, error: (err) => this.alert.showError("No se pudo actualizar el estado del inventario", "Control de inventarios")
			})
			this.getListCompras();
		}
		console.log(this.control);
	}
	updateStatus() {
		this.compras_service
			.changeStatusById(this.id_to_edit, 'Aceptado')
			.subscribe({
				complete: () => {

					// this.updateControl();
					this.alert.showInfo("Actualizando stock de productos", "Control de inventarios")
					this.getListCompras();
					this.productDialog = false;
					this.estadoSeleccionado = this.current_state;
				},
				error: () => {
					this.alert.showError("No se pudo actualizar el stock", "Control de inventarios")
					console.error('no se pudo completar la compra');
				},
			});
	}

	hideDialogAndAccept() {

			console.log(this.current_state);

			if (this.current_state == 'Aceptado') {
				if (this.selectedBodega== null || this.control.fecha_caducidad == null || this.control.fecha_elaboracion == null) {
					this.alert.showWarnig("Debe llenar todos los campos", "Control de inventarios")
				} else {

					this.updateControl();
	// console.log(this.control);


				}

			}

		if (this.id_to_edit != 0 && this.current_state != 'Aceptado') {
				this.compras_service
					.changeStatusById(this.id_to_edit, this.current_state)
					.subscribe({
						next: (l) => console.warn(l),
						complete: () => {
							this.alert.showSuccess("Estado de pedido actualizado", "Control de inventarios");
							this.getListCompras();
							this.estadoSeleccionado = this.current_state;
						},
						error: () => this.alert.showError("No se pudo actualizar el pedido", "Control de inventarios")
					}); this.getListCompras();
			}


			this.submitted = false;



	}

	onRowEditInit(compra: Compra) {
		this.clonedProducts[compra.id!] = { ...compra };
	}

	onRowEditSave(compra: Compra) {
		if (compra.valor_total > 0) {
			delete this.clonedProducts[compra.id!];
		} else {
		}
	}

	onRowEditCancel(compra: Compra, index: number) {
		this.products2[index + 1] = this.clonedProducts[compra.id!];
		delete this.clonedProducts[compra.id!];
	}

	getListCompras() {
		this.compras_service
			.getCompra()
			.subscribe({
				next: (d) => (this.listaCompras = d),
				// complete: () => this.initBodegas(),
				error: () => console.log("no se pudo cargar los datos")
			});
	}
	initListCompras() {
		this.compras_service
			.getCompra()
			.subscribe({
				next: (d) => (this.listaCompras = d),
				complete: () => this.initBodegas(),
				error: () => console.log("no se pudo cargar los datos")
			});
	}

	//* Export to pdf
	extractData(datosTabla: any) {
		return datosTabla.map((row: any) => [row.id, row.valor_total, row.estado, row.fecha_pedido]);
	}

	async generaraPDF() {
		if (this.arraySelected <= 0) {
			alert("Seleccione todos los items de Control inventario a imprimir")
		} else {
			console.log(this.arraySelected)
			const pdf = new PdfMakeWrapper();
			pdf.pageOrientation('landscape')
			pdf.pageSize('A4')
			pdf.add(pdf.ln(2))
			pdf.add(new Txt("Reporte Control inventario").bold().italics().alignment('center').end);
			pdf.add(pdf.ln(2))
			pdf.add(new Table([
				['Id', 'Valor Total', 'Estado', 'Fecha Pedido'],
			]).widths(['*', '*', '*', '*']).layout(
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

	//!  sin uso por momento
	changeStatus(event: any, id: any) {
		// this.status = event.value.name;
		console.log(this.current_state, id);
	}

}
