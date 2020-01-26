export function remove<T>(arr: T[], item: T)
{
    const index = arr.indexOf(item);
    if (index >= 0)
    {
        arr.splice(index, 1);
    }
}