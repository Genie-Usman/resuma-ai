import { linearTransform } from '../../utils/helper';

const Rating = ({ level }) => {
    return (
        <div className="relative h-1 w-[128px] group-[.sidebar]:mx-auto">
            <div className="absolute inset-0 h-1 w-[128px] rounded bg-primary opacity-25" />
            <div
                className="absolute inset-0 h-1 rounded bg-primary overflow-hidden"
                style={{ width: linearTransform(level, 0, 5, 0, 6.5) }}
            />
        </div>
    );
};

export default Rating;
