import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { TuiAlertService, TuiNotification } from '@taiga-ui/core';
import { catchError, Observable, of, tap } from 'rxjs';
import { ImageProcessingService } from 'src/app/@core/service/image-processing.service';
import { handleError } from 'src/app/@shared/utils/handle-eror.utils';
import { environment } from 'src/environments/environment';
import { ColorStore } from './color.store';
@Injectable({
	providedIn: 'root',
})
export class ColorService {
	private URL: string = `${environment.API_URL_BASE}/color`;

	constructor(
		private http: HttpClient,
		private store: ColorStore,
		@Inject(TuiAlertService)
		private readonly alertService: TuiAlertService,
		private ImagerService: ImageProcessingService
	) {}
	getAll(): Observable<any> {
		this.store.setLoading(true);
		return this.http.get<any>(this.URL).pipe(
			tap((data) => {
				if (data) {
					this.store.update((state) => ({
						colors: data,
					}));
				}
				this.store.setLoading(false);
			}),
			catchError((error: HttpErrorResponse) => {
				this.store.setLoading(false);
				this.store.update((state) => ({
					error: handleError(error),
				}));
				return of();
			})
		);
	}
	create(request: any) {
		return this.http.post<any>(this.URL, request).pipe(
			tap((data) => {
				if (data) {
					this.alertService
						.open('Thêm Thành công', {
							label: 'Thông báo',
							status: TuiNotification.Success,
							autoClose: true,
						})
						.subscribe();
				}
			}),
			catchError((error: HttpErrorResponse) => {
				this.alertService
					.open('Thêm thất bại, xin vùi lòng thử lại sau', {
						label: 'Thông báo',
						status: TuiNotification.Error,
						autoClose: true,
					})
					.subscribe();
				return of();
			})
		);
	}
	updateById(id: number, request: any): Observable<any> {
		this.store.setLoading(true);
		return this.http.put<any>(this.URL + '/' + id, request).pipe(
			tap((data) => {
				if (data) {
					this.alertService
						.open('Cập nhật Thành công', {
							label: 'Thông báo',
							status: TuiNotification.Success,
							autoClose: true,
						})
						.subscribe();
					this.store.setLoading(false);
				}
			}),
			catchError((error: HttpErrorResponse) => {
				this.alertService
					.open('Cập nh thất bại, xin vùi lòng thử lại sau', {
						label: 'Thông báo',
						status: TuiNotification.Error,
						autoClose: true,
					})
					.subscribe();
				this.store.setLoading(false);
				return of();
			})
		);
	}

	deleteById(id: number): Observable<any> {
		return this.http.delete<any>(this.URL + '/' + id).pipe(
			tap((data) => {
				this.store.update((state) => ({
					colors: state.colors.filter((e: any) => {
						return e.id !== id;
					}),
				}));
				this.alertService
					.open('Xóa Thành công', {
						label: 'Thông báo',
						status: TuiNotification.Success,
						autoClose: true,
					})
					.subscribe();
			}),
			catchError((error: HttpErrorResponse) => {
				this.alertService
					.open('Xóa thất bại, xin vùi lòng thử lại sau', {
						label: 'Thông báo',
						status: TuiNotification.Error,
						autoClose: true,
					})
					.subscribe();
				return of();
			})
		);
	}
	findById(id: number) {
		this.store.setLoading(true);
		return this.http.get<any>(this.URL + '/' + id).pipe(
			tap((data) => {
				if (data) {
					this.store.update((state) => ({
						color: data,
					}));
					this.store.setLoading(false);
				}
			}),
			catchError((error: HttpErrorResponse) => {
				this.store.update((state) => ({
					error: handleError(error),
				}));
				this.store.setLoading(false);
				return of();
			})
		);
	}
}
