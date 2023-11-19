import {delay, tap} from 'rxjs';
import {HttpClient} from '@angular/common/http';

export class CrudService<T> {
	
	constructor(protected http: HttpClient, private API_URL: string) {}
	
	public list() {
		return this.http.get<T[]>(this.API_URL).pipe(
			delay(250),
			tap(console.log)
		);
	}
	
	public loadByID(id: number) {
		return this.http.get<T>(`${this.API_URL}/${id}`).pipe();
	}
	
	private create(record: T) {
		return this.http.post(this.API_URL, record).pipe();
	}
	
	private update(record: T) {
		return this.http.put(`${this.API_URL}/${record['id' as keyof T]}`, record).pipe();
	}
	
	public save(record: T) {
		if(record['id' as keyof T]) {
			return this.update(record);
		}
		return this.create(record);
	}
	
	public remove(id: number) {
		return this.http.delete(`${this.API_URL}/${id}`).pipe();
	}
	
}
