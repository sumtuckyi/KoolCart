import StarBorderRoundedIcon from '@mui/icons-material/StarBorderRounded';
import BakeryDiningIcon from '@mui/icons-material/BakeryDining';

export default function ProductList({ array }) {
return (
	<>
		{
			array.map((pdt, i) => {
				return (
				<ProductCard 
					key={i} 
					item={array[i].item} 
					count={array[i].count}
					exp={array[i].exp}
				/>
			)
			})
		}
	</>
)
}


export function ProductCard(props) {
	return (
		<div className="card">
			<div>
				<p>{props.item}</p>
				<BakeryDiningIcon fontSize='large' />
				<p>수량 : {props.count}</p>
				<p>소비기한/유통기한 :{props.exp}일</p>
			</div>
				<div id='buttons'>
					<button>-</button>
					<button>+</button>
				</div>
				<StarBorderRoundedIcon onClick={() => {
					console.log('즐겨찾기 토글')
				}} />
		</div>
	)
}


