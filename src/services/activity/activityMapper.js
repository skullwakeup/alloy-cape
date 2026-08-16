export function mapActivity(activity) {

    return {

        id: activity.id,

        title: activity.title,

        type: activity.type,

        createdAt: activity.created_at,

    };

}